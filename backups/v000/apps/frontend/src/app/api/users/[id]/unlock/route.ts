import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { AuditEventType } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        lockedUntil: null,
        loginAttempts: 0,
      },
      select: {
        id: true,
        email: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        eventType: AuditEventType.ACCOUNT_UNLOCKED,
        eventDetail: `Unlocked user account: ${user.email}`,
        success: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unlocking user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}