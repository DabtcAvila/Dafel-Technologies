import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileId = params.id;

    // Get file metadata from database
    const userFile = await prisma.userFile.findUnique({
      where: { id: fileId },
      include: {
        user: {
          select: {
            email: true,
            companyName: true
          }
        }
      }
    });

    if (!userFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete file from disk if it exists
    const filePath = join(process.cwd(), userFile.filePath);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
      } catch (error) {
        console.warn('Could not delete file from disk:', error);
      }
    }

    // Mark file as inactive in database (soft delete)
    await prisma.userFile.update({
      where: { id: fileId },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}