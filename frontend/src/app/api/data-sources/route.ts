import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { DataSourceType, DataSourceStatus } from '@prisma/client';
import crypto from 'crypto';

// Simple encryption for credentials (using built-in crypto)
function encryptCredential(text: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(
    process.env.ENCRYPTION_KEY || 
    'a'.repeat(32), // Default key for development
    'utf8'
  ).slice(0, 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

// Validation schema for creating data source
const createDataSourceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.nativeEnum(DataSourceType),
  host: z.string().optional(),
  port: z.number().optional(),
  database: z.string().optional(),
  ssl: z.boolean().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  apiKey: z.string().optional(),
  configuration: z.record(z.any()).optional(),
});

// GET /api/data-sources - Get all data sources for the current user
export async function GET(request: NextRequest) {
  try {
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

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { createdById: user.id };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const dataSources = await prisma.dataSource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        status: true,
        host: true,
        database: true,
        lastConnectionTest: true,
        lastSuccessfulSync: true,
        connectionError: true,
        totalRecords: true,
        totalSyncs: true,
        failedSyncs: true,
        avgResponseTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(dataSources);
  } catch (error) {
    console.error('Error fetching data sources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data sources' },
      { status: 500 }
    );
  }
}

// POST /api/data-sources - Create a new data source
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    
    // Validate request body
    const validatedData = createDataSourceSchema.parse(body);

    console.log('Creating data source:', {
      name: validatedData.name,
      type: validatedData.type,
      host: validatedData.host,
    });

    // Encrypt sensitive fields
    let encryptedPassword = null;
    let encryptedApiKey = null;

    if (validatedData.password) {
      try {
        encryptedPassword = encryptCredential(validatedData.password);
      } catch (err) {
        console.error('Failed to encrypt password:', err);
        // For development, store as-is if encryption fails
        encryptedPassword = validatedData.password;
      }
    }

    if (validatedData.apiKey) {
      try {
        encryptedApiKey = encryptCredential(validatedData.apiKey);
      } catch (err) {
        console.error('Failed to encrypt API key:', err);
        encryptedApiKey = validatedData.apiKey;
      }
    }

    // Create the data source
    const dataSource = await prisma.dataSource.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        status: DataSourceStatus.CONFIGURING,
        host: validatedData.host,
        port: validatedData.port,
        database: validatedData.database,
        ssl: validatedData.ssl || false,
        username: validatedData.username,
        password: encryptedPassword,
        apiKey: encryptedApiKey,
        configuration: validatedData.configuration || {},
        createdById: user.id,
      },
    });

    console.log('Data source created:', dataSource.id);

    // Return the created data source (without sensitive fields)
    const { password: _, apiKey: __, ...safeDataSource } = dataSource;
    
    return NextResponse.json(safeDataSource, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating data source:', error);
    return NextResponse.json(
      { error: 'Failed to create data source' },
      { status: 500 }
    );
  }
}