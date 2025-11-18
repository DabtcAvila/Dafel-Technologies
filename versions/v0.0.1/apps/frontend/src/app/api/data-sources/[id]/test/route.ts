import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { DataSourceStatus } from '@prisma/client';

/**
 * POST /api/data-sources/[id]/test
 * Test data source connection
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the data source
    const dataSource = await prisma.dataSource.findFirst({
      where: {
        id: params.id,
        createdById: user.id,
      },
    });

    if (!dataSource) {
      return NextResponse.json({ error: 'Data source not found' }, { status: 404 });
    }

    // Update status to testing
    await prisma.dataSource.update({
      where: { id: params.id },
      data: { status: DataSourceStatus.TESTING },
    });

    try {
      // For now, we'll do a simplified test for PostgreSQL
      if (dataSource.type === 'POSTGRESQL') {
        // Dynamic import to avoid build issues
        const pg = await import('pg');
        const { Pool } = pg;

        // Decrypt password if it's encrypted
        let password = dataSource.password || '';
        if (password && password.includes(':')) {
          // It's encrypted, try to decrypt
          try {
            const [ivHex, encrypted] = password.split(':');
            const algorithm = 'aes-256-cbc';
            const key = Buffer.from(
              process.env.ENCRYPTION_KEY || 'a'.repeat(32),
              'utf8'
            ).slice(0, 32);
            const iv = Buffer.from(ivHex, 'hex');
            
            const crypto = await import('crypto');
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            password = decrypted;
          } catch (decryptError) {
            console.error('Failed to decrypt password, using as-is:', decryptError);
          }
        }

        const pool = new Pool({
          host: dataSource.host || 'localhost',
          port: dataSource.port || 5432,
          database: dataSource.database || '',
          user: dataSource.username || '',
          password: password,
          ssl: dataSource.ssl ? { rejectUnauthorized: false } : false,
          connectionTimeoutMillis: 5000,
        });

        try {
          // Test the connection
          const client = await pool.connect();
          
          // Get server info
          const versionResult = await client.query('SELECT version()');
          const dbResult = await client.query('SELECT current_database()');
          const userResult = await client.query('SELECT current_user');
          
          const serverInfo = {
            version: versionResult.rows[0].version,
            database: dbResult.rows[0].current_database,
            user: userResult.rows[0].current_user,
          };

          client.release();
          await pool.end();

          const responseTime = Date.now() - startTime;

          // Update data source with success
          await prisma.dataSource.update({
            where: { id: params.id },
            data: {
              status: DataSourceStatus.CONNECTED,
              lastConnectionTest: new Date(),
              connectionError: null,
              avgResponseTime: responseTime,
              configuration: {
                ...((dataSource.configuration as object) || {}),
                serverInfo,
              },
            },
          });

          return NextResponse.json({
            success: true,
            message: 'Connection successful',
            responseTime,
            status: DataSourceStatus.CONNECTED,
            serverInfo,
          });

        } catch (pgError: any) {
          await pool.end();
          throw pgError;
        }
      } else {
        // For other types, return a mock success for now
        const responseTime = Date.now() - startTime;

        await prisma.dataSource.update({
          where: { id: params.id },
          data: {
            status: DataSourceStatus.CONNECTED,
            lastConnectionTest: new Date(),
            avgResponseTime: responseTime,
          },
        });

        return NextResponse.json({
          success: true,
          message: `${dataSource.type} connector testing (simulated)`,
          responseTime,
          status: DataSourceStatus.CONNECTED,
        });
      }

    } catch (connectionError: any) {
      // Update status to error
      await prisma.dataSource.update({
        where: { id: params.id },
        data: {
          status: DataSourceStatus.ERROR,
          connectionError: connectionError.message || 'Connection failed',
          lastConnectionTest: new Date(),
        },
      });

      // Return specific error information
      return NextResponse.json({
        success: false,
        message: connectionError.message || 'Connection failed',
        errorType: connectionError.code || 'UNKNOWN',
        responseTime: Date.now() - startTime,
        status: DataSourceStatus.ERROR,
      });
    }

  } catch (error: any) {
    console.error('Test route error:', error);
    
    // Try to update status
    try {
      await prisma.dataSource.update({
        where: { id: params.id },
        data: {
          status: DataSourceStatus.ERROR,
          connectionError: 'Test failed unexpectedly',
          lastConnectionTest: new Date(),
        },
      });
    } catch (updateError) {
      console.error('Failed to update status:', updateError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test connection',
        message: error?.message || 'Unknown error',
        responseTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}