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

    const { id: coachingId } = await params;// Fetch coaching institute with all related data
    const coaching = await prisma.coaching.findUnique({
      where: { id: coachingId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            city: true,
            age: true,
            schoolOrCollege: true
          }
        },
        profiles: {
          include: {
            courses: {
              select: {
                id: true,
                courseName: true,
                courseAmount: true,
                courseDuration: true,
                enrollments: {
                  select: {
                    id: true
                  }
                }
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
      }
    });

    if (!coaching) {
      return NextResponse.json({ error: 'Coaching institute not found' }, { status: 404 });
    }    // Get the main profile for additional data
    const mainProfile = coaching.profiles?.[0];
      // Transform data for frontend to match the expected interface
    const transformedCoaching = {
      id: coaching.id,
      name: coaching.organizationName,
      description: mainProfile?.description || '',
      address: mainProfile?.address || '',
      phone: coaching.ownerPhone,
      email: coaching.ownerEmail,
      website: mainProfile?.website || '',
      establishedYear: mainProfile?.establishedYear,
      registrationNumber: coaching.panNumber || '',
      logo: mainProfile?.logo,
      facilities: mainProfile?.facilities?.join(', ') || '',
      accreditation: '', // Not in current schema
      achievements: '', // Not in current schema
      approvalStatus: coaching.approved ? 'APPROVED' : 'PENDING',
      createdAt: coaching.createdAt.toISOString(),
      updatedAt: coaching.updatedAt.toISOString(),
      owner: {
        id: coaching.owner.id,
        name: coaching.owner.name,
        email: coaching.owner.email,
        phone: coaching.owner.phoneNumber,
      },
      courses: mainProfile?.courses?.map((course: any) => ({
        id: course.id,
        title: course.courseName,
        category: course.category || 'General',
        duration: course.courseDuration || '',
        price: course.courseAmount,
        isActive: true, // Default to true since this field doesn't exist in schema
        _count: {
          enrollments: course.enrollments?.length || 0
        }
      })) || [],
      _count: {
        courses: mainProfile?.courses?.length || 0,
        enrollments: 0, // Would need additional query for total enrollments
        coaches: coaching._count.profiles,
      }
    };

    return NextResponse.json(transformedCoaching);

  } catch (error) {
    console.error('Error fetching coaching institute details:', error);
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

    const { id: coachingId } = await params;
    const body = await request.json();

    // Find the coaching and its main profile
    const existingCoaching = await prisma.coaching.findUnique({
      where: { id: coachingId },
      include: {
        profiles: true
      }
    });

    if (!existingCoaching) {
      return NextResponse.json({ error: 'Coaching institute not found' }, { status: 404 });
    }

    const mainProfile = existingCoaching.profiles[0];

    // Update coaching institute and profile using transaction
    const updatedCoaching = await prisma.$transaction(async (tx) => {
      // Update main coaching data
      const coaching = await tx.coaching.update({
        where: { id: coachingId },
        data: {
          ...(body.name && { organizationName: body.name }),
          ...(body.phone && { ownerPhone: body.phone }),
          ...(body.email && { ownerEmail: body.email }),
          ...(body.registrationNumber && { panNumber: body.registrationNumber }),
          ...(body.approvalStatus && { approved: body.approvalStatus === 'APPROVED' }),
        }
      });

      // Update profile data if profile exists
      if (mainProfile && body) {
        await tx.coachingProfile.update({
          where: { id: mainProfile.id },
          data: {
            ...(body.description && { description: body.description }),
            ...(body.address && { address: body.address }),
            ...(body.website && { website: body.website }),
            ...(body.establishedYear && { establishedYear: parseInt(body.establishedYear) }),
            ...(body.facilities && { 
              facilities: body.facilities.split(',').map((f: string) => f.trim()).filter(Boolean)
            }),
          }
        });
      }

      return coaching;
    });

    return NextResponse.json({ 
      message: 'Coaching institute updated successfully',
      coaching: updatedCoaching 
    });

  } catch (error) {
    console.error('Error updating coaching institute:', error);
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

    const { id: coachingId } = await params;

    // Check if coaching institute exists and get counts
    const existingCoaching = await prisma.coaching.findUnique({
      where: { id: coachingId },
      include: {
        profiles: {
          include: {
            _count: {
              select: {
                courses: true
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
      }
    });

    if (!existingCoaching) {
      return NextResponse.json({ error: 'Coaching institute not found' }, { status: 404 });
    }

    // Calculate total courses and enrollments
    const totalCourses = existingCoaching.profiles.reduce((sum, profile) => sum + profile._count.courses, 0);

    // Delete all related records first (due to foreign key constraints)
    await prisma.$transaction(async (tx) => {
      // First, get all profile IDs
      const profileIds = existingCoaching.profiles.map(p => p.id);

      if (profileIds.length > 0) {
        // Delete course enrollments for all courses under these profiles
        await tx.courseEnrollment.deleteMany({
          where: {
            course: {
              profileId: {
                in: profileIds
              }
            }
          }
        });

        // Delete demo session bookings
        await tx.demoSessionBooking.deleteMany({
          where: {
            session: {
              profileId: {
                in: profileIds
              }
            }
          }
        });

        // Delete demo sessions
        await tx.demoSession.deleteMany({
          where: {
            profileId: {
              in: profileIds
            }
          }
        });

        // Delete orders
        await tx.order.deleteMany({
          where: {
            course: {
              profileId: {
                in: profileIds
              }
            }
          }
        });

        // Delete course reviews
        await tx.review.deleteMany({
          where: {
            course: {
              profileId: {
                in: profileIds
              }
            }
          }
        });

        // Delete courses
        await tx.course.deleteMany({
          where: {
            profileId: {
              in: profileIds
            }
          }
        });

        // Delete teachers
        await tx.teacher.deleteMany({
          where: {
            profileId: {
              in: profileIds
            }
          }
        });

        // Delete profile reviews
        await tx.review.deleteMany({
          where: {
            profileId: {
              in: profileIds
            }
          }
        });

        // Delete coaching profiles
        await tx.coachingProfile.deleteMany({
          where: {
            coachingId: coachingId
          }
        });
      }

      // Delete coaching reviews
      await tx.review.deleteMany({
        where: { coachingId: coachingId }
      });

      // Finally delete the coaching institute
      await tx.coaching.delete({
        where: { id: coachingId }
      });
    });

    return NextResponse.json({ 
      message: 'Coaching institute deleted successfully',
      deletedCounts: {
        profiles: existingCoaching._count.profiles,
        courses: totalCourses,
        reviews: existingCoaching._count.reviews
      }
    });

  } catch (error) {
    console.error('Error deleting coaching institute:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
