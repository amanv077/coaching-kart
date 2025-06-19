import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }    // Find user with this email and OTP using raw SQL
    const users = await prisma.$queryRaw<Array<{
      id: string;
      name: string;
      email: string;
      otp: string | null;
      otpExpiry: Date | null;
    }>>`
      SELECT id, name, email, otp, "otpExpiry" 
      FROM "users" 
      WHERE email = ${email} 
      AND otp = ${otp} 
      AND "otpExpiry" > NOW()
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    const user = users[0];    // Verify the user and clear OTP fields using raw SQL
    await prisma.$executeRaw`
      UPDATE "users" 
      SET "otpVerified" = true, 
          otp = NULL, 
          "otpExpiry" = NULL, 
          "emailVerified" = NOW() 
      WHERE id = ${user.id}
    `;

    // Get user roles
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      select: { role: true },
    });

    return NextResponse.json(
      {
        message: 'Email verified successfully! Your account is now active.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          otpVerified: true,
          emailVerified: new Date(),
          roles: userRoles.map(r => r.role),
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'OTP verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
