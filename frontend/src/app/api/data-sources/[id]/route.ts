import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { DataSourceType, DataSourceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Validation schema for updating data source
const updateDataSourceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  type: z.nativeEnum(DataSourceType).optional(),
  status: z.nativeEnum(DataSourceStatus).optional(),
  host: z.string().optional(),
  port: z.number().optional(),
  database: z.string().optional(),
  ssl: z.boolean().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  apiKey: z.string().optional(),
  configuration: z.record(z.any()).optional(),
});

// GET /api/data-sources/[id] - Get a single data source
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const dataSource = await prisma.dataSource.findFirst({
      where: {
        id: params.id,
        createdById: user.id,
      },
      include: {
        syncLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!dataSource) {
      return NextResponse.json({ error: 'Data source not found' }, { status: 404 });
    }

    // Remove sensitive fields
    const { password: _, apiKey: __, ...safeDataSource } = dataSource;
    
    return NextResponse.json(safeDataSource);
  } catch (error) {
    console.error('Error fetching data source:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data source' },
      { status: 500 }
    );
  }
}

// PUT /api/data-sources/[id] - Update a data source
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = updateDataSourceSchema.parse(body);

    // Check if data source exists and belongs to user
    const existingDataSource = await prisma.dataSource.findFirst({
      where: {
        id: params.id,
        createdById: user.id,
      },
    });

    if (!existingDataSource) {
      return NextResponse.json({ error: 'Data source not found' }, { status: 404 });
    }

    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...validatedData };

    // Encrypt sensitive fields if provided
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }

    if (validatedData.apiKey) {
      updateData.apiKey = await bcrypt.hash(validatedData.apiKey, 10);
    }

    // Update the data source
    const updatedDataSource = await prisma.dataSource.update({
      where: { id: params.id },
      data: updateData,
    });

    // Return the updated data source (without sensitive fields)
    const { password: _, apiKey: __, ...safeDataSource } = updatedDataSource;
    
    return NextResponse.json(safeDataSource);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating data source:', error);
    return NextResponse.json(
      { error: 'Failed to update data source' },
      { status: 500 }
    );
  }
}

// DELETE /api/data-sources/[id] - Delete a data source
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if data source exists and belongs to user
    const existingDataSource = await prisma.dataSource.findFirst({
      where: {
        id: params.id,
        createdById: user.id,
      },
    });

    if (!existingDataSource) {
      return NextResponse.json({ error: 'Data source not found' }, { status: 404 });
    }

    // Delete the data source (cascade delete will remove sync logs)
    await prisma.dataSource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Data source deleted successfully' });
  } catch (error) {
    console.error('Error deleting data source:', error);
    return NextResponse.json(
      { error: 'Failed to delete data source' },
      { status: 500 }
    );
  }
}