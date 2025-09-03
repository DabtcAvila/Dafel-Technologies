import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DataSourceStatus } from '@prisma/client';
import crypto from 'crypto';

/**
 * POST /api/test-demo
 * Test endpoint for demo database connection (development only)
 * This bypasses authentication for testing purposes
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const startTime = Date.now();

  try {
    // Get or create a test user
    let user = await prisma.user.findFirst({
      where: { email: 'admin@dafel.tech' },
    });

    if (!user) {
      return NextResponse.json({ error: 'Test user not found' }, { status: 404 });
    }

    // Create the demo data source
    const dataSource = await prisma.dataSource.create({
      data: {
        name: `Demo PostgreSQL ${Date.now()}`,
        type: 'POSTGRESQL',
        description: 'Test PostgreSQL database connection',
        host: 'localhost',
        port: 5432,
        database: 'dafel_db',
        username: 'dafel_user',
        password: encryptCredential('DafelSecure2025!'),
        ssl: false,
        status: DataSourceStatus.CREATED,
        createdById: user.id,
        configuration: {},
      },
    });

    console.log('Created data source:', dataSource.id);

    // Test the connection
    const pg = await import('pg');
    const { Pool } = pg;

    // Decrypt password
    let password = 'DafelSecure2025!';
    
    const pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'dafel_db',
      user: 'dafel_user',
      password: password,
      ssl: false,
      connectionTimeoutMillis: 5000,
    });

    try {
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

      // Get schema
      const tablesResult = await client.query(`
        SELECT 
          table_name,
          (SELECT COUNT(*) FROM information_schema.columns 
           WHERE table_name = t.table_name AND table_schema = 'public') as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);

      client.release();
      await pool.end();

      const responseTime = Date.now() - startTime;

      // Update data source with success
      await prisma.dataSource.update({
        where: { id: dataSource.id },
        data: {
          status: DataSourceStatus.CONNECTED,
          lastConnectionTest: new Date(),
          avgResponseTime: responseTime,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Demo test successful!',
        dataSourceId: dataSource.id,
        responseTime,
        serverInfo,
        schema: {
          tables: tablesResult.rows.map(t => ({
            name: t.table_name,
            columnCount: parseInt(t.column_count),
          })),
        },
      });

    } catch (pgError: any) {
      await pool.end();
      
      // Update status to error
      await prisma.dataSource.update({
        where: { id: dataSource.id },
        data: {
          status: DataSourceStatus.ERROR,
          connectionError: pgError.message,
        },
      });

      throw pgError;
    }

  } catch (error: any) {
    console.error('Test demo error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Test failed',
        responseTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

// Simple encryption for credentials
function encryptCredential(text: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(
    process.env.ENCRYPTION_KEY || 'a'.repeat(32),
    'utf8'
  ).slice(0, 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}