import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { DataSourceStatus } from '@prisma/client';

// Simulated connection test for different source types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function testConnection(dataSource: any): Promise<{
  success: boolean;
  message: string;
  responseTime?: number;
}> {
  const startTime = Date.now();
  
  try {
    // Simulate connection based on type
    switch (dataSource.type) {
      case 'POSTGRESQL':
      case 'MYSQL':
        // In production, you would actually connect to the database
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
        break;
        
      case 'REST_API':
      case 'GRAPHQL':
        // In production, you would make an actual API call
        await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));
        break;
        
      case 'MONGODB':
        // In production, you would connect to MongoDB
        await new Promise(resolve => setTimeout(resolve, Math.random() * 900 + 400));
        break;
        
      case 'S3':
        // In production, you would test S3 connection
        await new Promise(resolve => setTimeout(resolve, Math.random() * 600 + 300));
        break;
        
      case 'GOOGLE_SHEETS':
        // In production, you would test Google Sheets API
        await new Promise(resolve => setTimeout(resolve, Math.random() * 700 + 400));
        break;
        
      case 'CSV_FILE':
        // In production, you would check file access
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        break;
        
      default:
        throw new Error('Unsupported data source type');
    }

    const responseTime = Date.now() - startTime;
    
    // Simulate random success/failure for demo (80% success rate)
    const success = Math.random() > 0.2;
    
    if (success) {
      return {
        success: true,
        message: 'Connection successful',
        responseTime,
      };
    } else {
      throw new Error('Connection failed: Unable to reach the server');
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Connection failed',
      responseTime: Date.now() - startTime,
    };
  }
}

// POST /api/data-sources/[id]/test - Test data source connection
export async function POST(
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

    // Test the connection
    const result = await testConnection(dataSource);

    // Update data source with test results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      lastConnectionTest: new Date(),
      status: result.success ? DataSourceStatus.CONNECTED : DataSourceStatus.ERROR,
    };

    if (result.success) {
      updateData.connectionError = null;
      if (result.responseTime) {
        updateData.avgResponseTime = result.responseTime;
      }
    } else {
      updateData.connectionError = result.message;
    }

    const updatedDataSource = await prisma.dataSource.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: result.success,
      message: result.message,
      responseTime: result.responseTime,
      status: updatedDataSource.status,
    });
  } catch (error) {
    console.error('Error testing data source:', error);
    
    // Update status to error
    try {
      await prisma.dataSource.update({
        where: { id: params.id },
        data: { 
          status: DataSourceStatus.ERROR,
          connectionError: 'Test failed unexpectedly',
        },
      });
    } catch (updateError) {
      console.error('Error updating status:', updateError);
    }

    return NextResponse.json(
      { error: 'Failed to test data source connection' },
      { status: 500 }
    );
  }
}