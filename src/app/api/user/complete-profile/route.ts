import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const completeProfileSchema = z.object({
  bio: z.string().min(1, 'Bio is required'),
  interests: z.array(z.string()),
  learningGoals: z.array(z.string()),
  coachingMode: z.enum(['Online', 'Offline', 'Both']),
  preferredSubjects: z.array(z.string()),
  targetExams: z.array(z.string()),
  studyLevel: z.enum(['School', 'College', 'Competitive', 'Professional']),
  preferredCities: z.array(z.string()),
  budgetRange: z.string().optional(),
  sessionTimings: z.array(z.string()),
  // Online specific
  onlineClassFormat: z.string().optional(),
  devicePreference: z.string().optional(),
  internetSpeed: z.string().optional(),
  // Offline specific
  maxTravelDistance: z.string().optional(),
  transportMode: z.string().optional(),
  batchSize: z.enum(['Individual', 'Small', 'Medium', 'Large']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = completeProfileSchema.parse(body);

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...validatedData,
        profileCompleted: true,
        updatedAt: new Date(),
      },
    });    return NextResponse.json({
      message: 'Profile completed successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileCompleted: true,
      }
    });
  } catch (error) {
    console.error('Error completing profile:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
        profileCompleted: true,
        bio: true,
        interests: true,
        learningGoals: true,
        coachingMode: true,
        preferredSubjects: true,
        targetExams: true,
        studyLevel: true,
        preferredCities: true,
        budgetRange: true,
        sessionTimings: true,
        onlineClassFormat: true,
        devicePreference: true,
        internetSpeed: true,
        maxTravelDistance: true,
        transportMode: true,
        batchSize: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
