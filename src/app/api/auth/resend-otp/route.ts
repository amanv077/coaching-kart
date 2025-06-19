import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }    // Check if OTP columns exist
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
    }    // Find unverified user with this email using raw SQL
    const users = await prisma.$queryRaw<Array<{
      id: string;
      name: string;
      email: string;
      otpVerified: boolean | null;
    }>>`
      SELECT id, name, email, "otpVerified" 
      FROM "users" 
      WHERE email = ${email} 
      AND ("otpVerified" = false OR "otpVerified" IS NULL)
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No pending verification found for this email' },
        { status: 400 }
      );
    }

    const user = users[0];

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.name);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }    // Update user with new OTP using raw SQL
    await prisma.$executeRaw`
      UPDATE "users" 
      SET otp = ${otp}, 
          "otpExpiry" = ${otpExpiry} 
      WHERE id = ${user.id}
    `;

    return NextResponse.json(
      { 
        message: 'New OTP sent successfully. Please check your email.',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to resend OTP. Please try again.' },
      { status: 500 }
    );
  }
}
