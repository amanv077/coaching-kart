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
    const roleFilter = url.searchParams.get('role');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause for role filtering
    let whereClause: any = {};
    if (roleFilter) {
      whereClause.roles = {
        some: {
          role: roleFilter
        }
      };
    }    // Fetch users with their roles
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        roles: {
          select: {
            role: true
          }
        },
        _count: {
          select: {
            ownedCoachings: true,
            enrolledCourses: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalCount = await prisma.user.count({ where: whereClause });    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      age: user.age,
      classLevel: user.classLevel,
      schoolOrCollege: user.schoolOrCollege,
      roles: user.roles.map((r: { role: string }) => r.role),
      primaryRole: user.roles[0]?.role || 'STUDENT',
      createdAt: user.createdAt.toISOString(),
      coachingCount: user._count.ownedCoachings,
      enrollmentCount: user._count.enrolledCourses
    }));

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users by role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
