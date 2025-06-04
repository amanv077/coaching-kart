import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has ADMIN role
    const userRoles = session.user?.roles || [session.user?.role];
    const hasAdminRole = userRoles.includes('ADMIN');
    
    if (!hasAdminRole) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;    // Fetch coaching institutes with their profiles and courses
    const coachings = await prisma.coaching.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            city: true
          }
        },
        profiles: {
          select: {
            id: true,
            name: true,
            branchName: true,
            city: true,
            state: true,
            approved: true,
            verificationStatus: true,
            createdAt: true,
            courses: {
              select: {
                id: true,
                courseName: true,
                courseAmount: true,
                courseDuration: true
              }
            }
          }
        },
        _count: {
          select: {
            profiles: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalCount = await prisma.coaching.count();    // Transform data for frontend
    const transformedCoachings = coachings.map(coaching => {
      // Calculate total courses from all profiles
      const totalCourses = coaching.profiles.reduce((acc, profile) => acc + profile.courses.length, 0);
      
      // Get all courses from all profiles
      const allCourses = coaching.profiles.flatMap(profile => profile.courses);
      
      return {
        id: coaching.id,
        coachingId: coaching.coachingId,
        organizationName: coaching.organizationName,
        ownerName: coaching.ownerName,
        ownerEmail: coaching.ownerEmail,
        businessType: coaching.businessType,
        approved: coaching.approved,
        createdAt: coaching.createdAt.toISOString(),
        owner: coaching.owner,
        profiles: coaching.profiles,
        courses: allCourses,
        courseCount: totalCourses,
        profileCount: coaching._count.profiles,
        enrollmentCount: 0 // This would need to be calculated from course enrollments
      };
    });

    return NextResponse.json({
      coachings: transformedCoachings,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching coaching institutes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
