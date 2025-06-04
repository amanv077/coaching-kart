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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'all') {
      whereClause.roles = {
        some: {
          role: role.toUpperCase()
        }
      };
    }

    // Get users with roles and related data
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        roles: true,
        _count: {
          select: {
            ownedCoachings: true,
            enrolledCourses: true,
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalCount = await prisma.user.count({ where: whereClause });

    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      age: user.age,
      roles: user.roles,
      createdAt: user.createdAt.toISOString(),
      _count: user._count
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
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { userId, role, action, data } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Handle simple role update (from frontend)
    if (role && !action) {
      // Update user role using transaction
      await prisma.$transaction(async (tx) => {
        // Delete existing roles
        await tx.userRole.deleteMany({
          where: { userId }
        });
        
        // Add new role
        await tx.userRole.create({
          data: {
            userId,
            role: role
          }
        });
      });

      return NextResponse.json({ message: 'User role updated successfully' });
    }

    // Handle actions (for more complex updates)
    if (action) {
      switch (action) {
        case 'updateRole':
          if (!data?.role) {
            return NextResponse.json({ error: 'Role is required' }, { status: 400 });
          }

          // Update user role using transaction
          await prisma.$transaction(async (tx) => {
            // Delete existing roles
            await tx.userRole.deleteMany({
              where: { userId }
            });
            
            // Add new role
            await tx.userRole.create({
              data: {
                userId,
                role: data.role
              }
            });
          });

          return NextResponse.json({ message: 'User role updated successfully' });

        case 'updateProfile':
          const updateData: any = {};
          
          if (data.name) updateData.name = data.name;
          if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
          if (data.city !== undefined) updateData.city = data.city;
          if (data.age !== undefined) updateData.age = data.age;

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
          });

          return NextResponse.json({ 
            message: 'User profile updated successfully',
            user: updatedUser 
          });

        default:
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid request: either role or action must be provided' }, { status: 400 });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    // Try to get userId from query params first, then from request body
    let userId = new URL(request.url).searchParams.get('userId');
    
    if (!userId) {
      const body = await request.json();
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent deleting own account
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Delete user and all related data using transaction
    await prisma.$transaction(async (tx) => {
      // Delete user roles first
      await tx.userRole.deleteMany({
        where: { userId }
      });
      
      // Delete user
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
