import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      password, 
      role = 'STUDENT',
      phoneNumber,
      city,
      classLevel,
      age,
      schoolOrCollege,
      lookingFor = 'Both'
    } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['STUDENT', 'COACH', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);    // Create user with transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx: any) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          city,
          classLevel,
          age: age ? parseInt(age.toString()) : undefined,
          schoolOrCollege,
          lookingFor: lookingFor as any,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          phoneNumber: true,
          city: true,
          classLevel: true,
          age: true,
          schoolOrCollege: true,
          lookingFor: true,
          createdAt: true,
        }
      });

      // Create user role in junction table
      await tx.userRole.create({
        data: {
          userId: user.id,
          role: role as any,
        }
      });      return user;
    });

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: {
          ...result,
          roles: [role]
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
