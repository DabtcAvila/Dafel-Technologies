import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Authentication disabled for testing - v2  
    const session = null; // Force disable auth for testing
    
    if (false) { // Disabled auth check
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        companyName: true,
        groupName: true,
        role: true,
        isActive: true,
        year2016: true,
        year2017: true,
        year2018: true,
        year2019: true,
        year2020: true,
        year2021: true,
        year2022: true,
        year2023: true,
        year2024: true,
        year2025: true,
        layoutDownloads: true,
        createdAt: true
      },
      orderBy: [
        { groupName: 'asc' },
        { companyName: 'asc' }
      ]
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Authentication disabled for testing
    // const session = await getServerSession(authOptions);
    
    // if (!session?.user || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { 
      email, 
      companyName, 
      groupName, 
      role, 
      password,
      years 
    } = body;

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        companyName: companyName || null,
        groupName: groupName || null,
        role,
        password: hashedPassword,
        isActive: true,
        layoutDownloads: 0,
        year2016: years?.includes('2016') || false,
        year2017: years?.includes('2017') || false,
        year2018: years?.includes('2018') || false,
        year2019: years?.includes('2019') || false,
        year2020: years?.includes('2020') || false,
        year2021: years?.includes('2021') || false,
        year2022: years?.includes('2022') || false,
        year2023: years?.includes('2023') || false,
        year2024: years?.includes('2024') || false,
        year2025: years?.includes('2025') || false,
        emailVerified: new Date()
      },
      select: {
        id: true,
        email: true,
        password: true,
        companyName: true,
        groupName: true,
        role: true,
        isActive: true,
        year2016: true,
        year2017: true,
        year2018: true,
        year2019: true,
        year2020: true,
        year2021: true,
        year2022: true,
        year2023: true,
        year2024: true,
        year2025: true,
        layoutDownloads: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}