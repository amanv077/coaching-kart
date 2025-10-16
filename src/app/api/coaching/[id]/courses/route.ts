import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseName } = await request.json();
    
    if (!courseName || typeof courseName !== 'string') {
      return NextResponse.json({ error: 'Course name is required' }, { status: 400 });
    }

    const { id } = params;
    const coachingId = id;

    // Verify coaching ownership
    const coaching = await prisma.coaching.findFirst({
      where: {
        id: coachingId,
        ownerUserId: session.user.id,
      },
    });

    if (!coaching) {
      return NextResponse.json({ error: 'Coaching not found or unauthorized' }, { status: 404 });
    }

    // Get the first profile for this coaching (you might want to specify which profile)
    const profile = await prisma.coachingProfile.findFirst({
      where: {
        coachingId: coachingId,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'No coaching profile found' }, { status: 404 });
    }

    // Check if course already exists for this profile
    const existingCourse = await prisma.course.findFirst({
      where: {
        courseName: courseName.trim(),
        profileId: profile.id,
      },
    });

    if (existingCourse) {
      return NextResponse.json({ error: 'Course already exists' }, { status: 400 });
    }

    // Create the new course
    const course = await prisma.course.create({
      data: {
        courseName: courseName.trim(),
        profileId: profile.id,
        courseDuration: '30 days', // Default duration
        courseDescription: '', // Default empty description
        courseAmount: 0, // Default price
        courseMRP: 0, // Default MRP
        classLevel: 'General', // Default class level
        mode: 'Offline', // Default to offline mode
      },
    });

    return NextResponse.json({ 
      success: true, 
      course: {
        id: course.id,
        courseName: course.courseName,
      }
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
