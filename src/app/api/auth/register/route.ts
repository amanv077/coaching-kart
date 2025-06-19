import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/types/auth';
import { generateOTP, sendOTPEmail } from '@/lib/email';

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
    }    // Check if OTP columns exist and add them if necessary
    try {
      await prisma.$executeRaw`SELECT "otpVerified" FROM "users" LIMIT 1`;
    } catch (columnError) {
      console.log('OTP columns do not exist, adding them...');
      try {
        await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otpVerified" BOOLEAN DEFAULT false`;
        await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otp" TEXT`;
        await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3)`;
      } catch (alterError) {
        console.error('Error adding OTP columns:', alterError);
        return NextResponse.json(
          { error: 'Database schema error. Please contact support.' },
          { status: 500 }
        );
      }
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

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }    // Create user with OTP verification required (not verified initially)
    const result = await prisma.$transaction(async (tx: any) => {
      // Try using Prisma client first, fall back to basic creation if OTP fields don't exist
      let user;
      try {
        user = await tx.user.create({
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
            otp,
            otpExpiry,
            otpVerified: false,
          },
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            city: true,
            classLevel: true,
            age: true,
            schoolOrCollege: true,
            lookingFor: true,
            otpVerified: true,
            createdAt: true,
          }
        });
      } catch (prismaError: any) {
        // If OTP fields don't exist, create user without them and update with raw SQL
        console.log('Creating user without OTP fields, will update separately...');
        user = await tx.user.create({
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

        // Update with OTP fields using raw SQL
        await tx.$executeRaw`
          UPDATE "users" 
          SET otp = ${otp}, 
              "otpExpiry" = ${otpExpiry}, 
              "otpVerified" = false 
          WHERE id = ${user.id}
        `;
        
        // Add otpVerified to the return object
        user = { ...user, otpVerified: false };
      }

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
        message: 'Registration initiated. Please verify your email with the OTP sent.',
        email: email,
        requiresOTP: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
