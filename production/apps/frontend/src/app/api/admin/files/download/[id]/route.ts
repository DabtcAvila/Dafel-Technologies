import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileId = params.id;

    // Get file metadata from database
    const userFile = await prisma.userFile.findUnique({
      where: { 
        id: fileId,
        isActive: true
      },
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

    // Check permissions
    const canDownload = 
      session.user.role === 'ADMIN' ||
      session.user.role === 'EDITOR' ||
      (session.user.role === 'CLIENT' && userFile.userId === session.user.id);

    if (!canDownload) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Check if file exists on disk
    const filePath = join(process.cwd(), userFile.filePath);
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    // Read file from disk
    const fileBuffer = await readFile(filePath);

    // Create response with appropriate headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': userFile.mimetype,
        'Content-Length': userFile.size.toString(),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(userFile.originalName)}"`,
        'Cache-Control': 'private, no-cache',
      },
    });

    return response;
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}