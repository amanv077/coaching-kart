import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: userId } = await params;// Fetch user with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select: {
            role: true
          }
        },
        ownedCoachings: {
          include: {
            profiles: {
              select: {
                id: true,
                name: true,
                branchName: true,
                approved: true,
                verificationStatus: true
              }
            }
          }
        },
        enrolledCourses: {
          include: {
            course: {
              select: {
                id: true,
                courseName: true,
                courseAmount: true
              }
            }
          }
        },
        _count: {
          select: {
            ownedCoachings: true,
            enrolledCourses: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }    // Transform data for frontend
    const transformedUser = {
      id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      age: user.age,
      classLevel: user.classLevel,
      schoolOrCollege: user.schoolOrCollege,
      lookingFor: user.lookingFor,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      roles: (user as any).roles?.map((r: any) => r.role) || [],
      primaryRole: (user as any).roles?.[0]?.role || 'STUDENT',
      coachingCenters: (user as any).ownedCoachings || [],
      enrollments: (user as any).enrolledCourses || [],
      coachingCount: (user as any)._count?.ownedCoachings || 0,
      enrollmentCount: (user as any)._count?.enrolledCourses || 0
    };

    return NextResponse.json({ user: transformedUser });

  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: userId } = await params;
    const body = await request.json();

    // Extract fields that can be updated
    const {
      name,
      email,
      phoneNumber,
      city,
      age,
      classLevel,
      schoolOrCollege,
      lookingFor,
      // Additional fields for different user types
      address,
      dateOfBirth,
      gender,
      emergencyContact,
      academicHistory,
      interests,
      learningGoals,
      experience,
      qualifications,
      specialization,
      bio,
      adminLevel,
      department,
      permissions
    } = body;    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select: {
            role: true
          }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(city && { city }),
        ...(age && { age }),
        ...(classLevel && { classLevel }),
        ...(schoolOrCollege && { schoolOrCollege }),
        ...(lookingFor && { lookingFor }),
        ...(address && { address }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(emergencyContact && { emergencyContact }),
        ...(academicHistory && { academicHistory }),
        ...(interests && { interests }),
        ...(learningGoals && { learningGoals }),
        ...(experience && { experience }),
        ...(qualifications && { qualifications }),
        ...(specialization && { specialization }),
        ...(bio && { bio }),
        ...(adminLevel && { adminLevel }),
        ...(department && { department }),
        ...(permissions && { permissions })
      },
      include: {
        roles: {
          select: {
            role: true
          }
        },
        ownedCoachings: {
          include: {
            profiles: {
              select: {
                id: true,
                name: true,
                branchName: true,
                approved: true,
                verificationStatus: true
              }
            }
          }
        },        enrolledCourses: {
          include: {
            course: {
              select: {
                id: true,
                courseName: true,
                courseAmount: true
              }
            }
          }
        }
      }
    });

    // Transform data for frontend
    const transformedUser = {
      id: updatedUser.id,
      userId: updatedUser.userId,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      city: updatedUser.city,
      age: updatedUser.age,
      classLevel: updatedUser.classLevel,
      schoolOrCollege: updatedUser.schoolOrCollege,
      lookingFor: updatedUser.lookingFor,
      emailVerified: updatedUser.emailVerified,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      roles: (updatedUser as any).roles?.map((r: any) => r.role) || [],
      primaryRole: (updatedUser as any).roles?.[0]?.role || 'STUDENT',
      coachingCenters: (updatedUser as any).ownedCoachings || [],
      enrollments: (updatedUser as any).enrolledCourses || []
    };

    return NextResponse.json({ 
      user: transformedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: userId } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            ownedCoachings: true,
            enrolledCourses: true,
            orders: true,
            reviews: true
          }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Use transaction to delete user and all related data
    await prisma.$transaction(async (tx) => {
      // Delete user roles
      await tx.userRole.deleteMany({
        where: { userId }
      });

      // Delete enrollments
      await tx.courseEnrollment.deleteMany({
        where: { userId }
      });

      // Delete orders
      await tx.order.deleteMany({
        where: { userId }
      });

      // Delete reviews
      await tx.review.deleteMany({
        where: { userId }
      });

      // Delete demo session bookings
      await tx.demoSessionBooking.deleteMany({
        where: { userId }
      });

      // Delete accounts and sessions (NextAuth)
      await tx.account.deleteMany({
        where: { userId }
      });

      await tx.session.deleteMany({
        where: { userId }
      });

      // If user owns coaching institutes, transfer ownership or handle appropriately
      // For now, we'll prevent deletion if user owns coaching institutes
      if (existingUser._count.ownedCoachings > 0) {
        throw new Error('Cannot delete user who owns coaching institutes. Please transfer ownership first.');
      }

      // Finally delete the user
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedCounts: {
        enrollments: existingUser._count.enrolledCourses,
        orders: existingUser._count.orders,
        reviews: existingUser._count.reviews
      }
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
