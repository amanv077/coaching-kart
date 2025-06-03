import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    // Fetch user's coachings with profiles and courses
    const coachings = await prisma.coaching.findMany({
      where: {
        ownerUserId: session.user.id,
      },
      include: {
        profiles: {
          include: {
            courses: {
              select: {
                id: true,
                courseName: true,
                courseAmount: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });    // Calculate basic stats using the included data
    const totalProfiles = coachings.reduce((acc, coaching) => acc + coaching.profiles.length, 0);
    const totalCourses = coachings.reduce((acc, coaching) => 
      acc + coaching.profiles.reduce((profileAcc, profile) => profileAcc + profile.courses.length, 0), 0);
    const pendingApprovals = coachings.filter(coaching => !coaching.approved).length;

    const stats = {
      totalCoachings: coachings.length,
      totalProfiles,
      totalCourses,
      totalStudents: 0, // This would need to be calculated from enrollments
      pendingApprovals,
      monthlyEarnings: 0, // This would need to be calculated from orders
    };

    return NextResponse.json({
      coachings,
      stats,
    });

  } catch (error) {
    console.error('Error fetching coachings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
