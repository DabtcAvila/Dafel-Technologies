import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

/**
 * GET /api/data-sources/[id]/schema
 * Get the schema information for a data source
 */
export async function GET(
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

    // Only SQL databases support schema discovery for now
    if (!['POSTGRESQL', 'MYSQL'].includes(dataSource.type)) {
      return NextResponse.json({ 
        error: 'Schema discovery not supported for this data source type',
        supportedTypes: ['POSTGRESQL', 'MYSQL']
      }, { status: 400 });
    }

    try {
      // For PostgreSQL, get schema information
      if (dataSource.type === 'POSTGRESQL') {
        const pg = await import('pg');
        const { Pool } = pg;

        // Decrypt password if it's encrypted
        let password = dataSource.password || '';
        if (password && password.includes(':')) {
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
            console.error('Failed to decrypt password:', decryptError);
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
          const client = await pool.connect();
          
          // Get all tables
          const tablesResult = await client.query(`
            SELECT 
              table_name,
              table_schema
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name
          `);

          const tables = [];
          
          for (const table of tablesResult.rows) {
            // Get columns for each table
            const columnsResult = await client.query(`
              SELECT 
                column_name,
                data_type,
                is_nullable,
                column_default
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = $1
              ORDER BY ordinal_position
            `, [table.table_name]);

            // Try to get row count (with timeout)
            let rowCount = null;
            try {
              const countResult = await client.query({
                text: `SELECT COUNT(*) as count FROM "${table.table_name}"`,
                timeout: 1000, // 1 second timeout for count
              });
              rowCount = parseInt(countResult.rows[0].count) || 0;
            } catch (err) {
              // Ignore count errors (might be permission issues or large tables)
              console.log(`Could not get count for ${table.table_name}`);
            }

            tables.push({
              name: table.table_name,
              schema: 'public',
              columns: columnsResult.rows.map(col => ({
                name: col.column_name,
                type: col.data_type,
                nullable: col.is_nullable === 'YES',
                defaultValue: col.column_default,
              })),
              rowCount,
            });
          }

          client.release();
          await pool.end();

          const responseTime = Date.now() - startTime;

          return NextResponse.json({
            success: true,
            schema: { tables },
            metadata: {
              dataSourceId: params.id,
              dataSourceName: dataSource.name,
              dataSourceType: dataSource.type,
              schemaName: 'public',
              fetchTime: responseTime,
              timestamp: new Date().toISOString(),
            },
          });

        } catch (pgError: any) {
          await pool.end();
          throw pgError;
        }
      } else {
        // For other types, return empty schema
        return NextResponse.json({
          success: true,
          schema: { tables: [] },
          metadata: {
            dataSourceId: params.id,
            dataSourceName: dataSource.name,
            dataSourceType: dataSource.type,
            message: 'Schema discovery not yet implemented for this type',
          },
        });
      }

    } catch (connectionError: any) {
      console.error('Schema fetch error:', connectionError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch schema',
        message: connectionError.message || 'Unknown error',
        responseTime: Date.now() - startTime,
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Unexpected error fetching schema:', error);

    return NextResponse.json(
      { 
        error: 'Failed to fetch schema',
        message: error?.message || 'Unknown error',
        responseTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}