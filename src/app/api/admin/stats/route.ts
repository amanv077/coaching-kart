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

    // Get platform statistics
    const [
      totalUsers,
      totalCoachings,
      totalCourses,
      pendingApprovals,
      totalOrders,
      recentUsers
    ] = await Promise.all([
      // Total users count with role breakdown
      prisma.user.count(),
      
      // Total coachings
      prisma.coaching.count(),
      
      // Total courses
      prisma.course.count(),
      
      // Pending coaching profile approvals
      prisma.coachingProfile.count({
        where: { approved: false }
      }),
      
      // Total orders for revenue calculation
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: true
      }),
      
      // Recent user registrations
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: true
        }
      })
    ]);

    // Get role-specific counts
    const roleStats = await prisma.userRole.groupBy({
      by: ['role'],
      _count: {
        userId: true
      }
    });

    const roleBreakdown = {
      ADMIN: 0,
      COACH: 0,
      STUDENT: 0
    };

    roleStats.forEach(stat => {
      roleBreakdown[stat.role as keyof typeof roleBreakdown] = stat._count.userId;
    });

    const stats = {
      totalUsers,
      totalCoaches: roleBreakdown.COACH,
      totalStudents: roleBreakdown.STUDENT,
      totalAdmins: roleBreakdown.ADMIN,
      totalCoachings,
      totalCourses,
      pendingApprovals,
      totalRevenue: totalOrders._sum.totalAmount || 0,
      totalOrders: totalOrders._count,
      monthlyGrowth: 12.5, // This would be calculated based on historical data
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map(r => r.role),
        createdAt: user.createdAt.toISOString()
      }))
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
