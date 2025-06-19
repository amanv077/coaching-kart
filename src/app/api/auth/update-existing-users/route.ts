import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting to update existing users with OTP verification...');

    // First, let's check if the otpVerified column exists by trying a raw query
    try {
      await prisma.$executeRaw`SELECT "otpVerified" FROM "User" LIMIT 1`;
      console.log('otpVerified column exists');
    } catch (columnError) {
      console.log('otpVerified column does not exist, attempting to add it...');
      
      // Add the missing columns if they don't exist
      try {
        await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otpVerified" BOOLEAN DEFAULT false`;
        await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otp" TEXT`;
        await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3)`;
        console.log('OTP columns added successfully');
      } catch (alterError) {
        console.error('Error adding columns:', alterError);
        return NextResponse.json(
          { error: 'Failed to add OTP columns to database' },
          { status: 500 }
        );
      }
    }

    // Update all existing users to have otpVerified = true using raw SQL
    const result = await prisma.$executeRaw`
      UPDATE "User" 
      SET "otpVerified" = true 
      WHERE "otpVerified" = false OR "otpVerified" IS NULL
    `;

    console.log(`Updated users with otpVerified = true`);
    
    // Get count of users
    const userCount = await prisma.user.count();
    
    // Get some sample users to verify
    const sampleUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      take: 5,
    });

    return NextResponse.json(
      { 
        message: `Successfully updated existing users. Total users: ${userCount}`,
        sampleUsers: sampleUsers.map(user => ({
          name: user.name,
          email: user.email,
          id: user.id,
        })),
        sqlResult: result,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update existing users', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
