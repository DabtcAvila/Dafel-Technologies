import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prismaHub } from '@/lib/prisma-hub';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can view audit logs
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const auditLogs = await prismaHub.auditLog.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        eventType: true,
        eventDetail: true,
        success: true,
        createdAt: true,
        userId: true,
      },
    });

    // Get user information for the logs
    const userIds = [...new Set(auditLogs.map(log => log.userId).filter(Boolean))];
    const users = await prismaHub.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    const userMap = Object.fromEntries(
      users.map(user => [user.id, user])
    );

    // Add user information to logs
    const logsWithUsers = auditLogs.map(log => ({
      ...log,
      user: log.userId ? userMap[log.userId] : null,
    }));

    return NextResponse.json(logsWithUsers);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}