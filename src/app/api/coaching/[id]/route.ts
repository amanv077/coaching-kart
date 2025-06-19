import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/coaching/[id] - Get coaching details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const coachingId = id;

    const coaching = await prisma.coaching.findUnique({
      where: { coachingId },
      include: {
        profiles: {
          include: {
            courses: true,
            teachers: true,
          },
        },
      },
    });

    if (!coaching) {
      return NextResponse.json({ error: 'Coaching not found' }, { status: 404 });
    }

    return NextResponse.json(coaching);
  } catch (error) {
    console.error('Error fetching coaching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/coaching/[id] - Update coaching details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const coachingId = id;
    const body = await request.json();

    // First, verify the coaching exists and belongs to the user
    const existingCoaching = await prisma.coaching.findUnique({
      where: { coachingId },
      include: { profiles: true },
    });

    if (!existingCoaching) {
      return NextResponse.json({ error: 'Coaching not found' }, { status: 404 });
    }

    if (existingCoaching.ownerUserId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update coaching organization details
    const updatedCoaching = await prisma.coaching.update({
      where: { coachingId },
      data: {
        organizationName: body.organizationName,
        isActive: body.isActive,
        // approved status should only be changed by admins, not coaches
      },
      include: {
        profiles: {
          include: {
            courses: true,
            teachers: true,
          },
        },
      },
    });

    // Update profiles if provided
    if (body.profiles && Array.isArray(body.profiles)) {
      for (const profileData of body.profiles) {
        if (profileData.id) {
          // Update existing profile
          await prisma.coachingProfile.update({
            where: { id: profileData.id },
            data: {
              name: profileData.name,
              branchName: profileData.branchName,
              city: profileData.city,
              state: profileData.state,
              description: profileData.description,
              tagline: profileData.tagline,
              contactNumber: profileData.contactNumber,
              email: profileData.email,
              establishedYear: profileData.establishedYear,
              subjectsOffered: profileData.subjectsOffered,
              examsOffered: profileData.examsOffered,
              facilities: profileData.facilities,
            },
          });

          // Update courses for this profile
          if (profileData.courses) {
            // Delete existing courses and recreate them
            await prisma.course.deleteMany({
              where: { profileId: profileData.id },
            });

            for (const course of profileData.courses) {
              await prisma.course.create({
                data: {
                  courseName: course.courseName,
                  courseAmount: course.courseAmount,
                  profileId: profileData.id,
                  // Add required fields with defaults
                  courseDuration: '1 year',
                  courseDescription: course.courseName,
                  courseMRP: course.courseAmount,
                  classLevel: 'General',
                },
              });
            }
          }

          // Update teachers for this profile
          if (profileData.teachers) {
            // Delete existing teachers and recreate them
            await prisma.teacher.deleteMany({
              where: { profileId: profileData.id },
            });

            for (const teacher of profileData.teachers) {
              await prisma.teacher.create({
                data: {
                  name: teacher.name,
                  qualification: teacher.qualification,
                  experience: parseInt(teacher.experience) || 0,
                  profileImage: teacher.image,
                  bio: teacher.description,
                  profileId: profileData.id,
                  specialization: [],
                },
              });
            }
          }
        }
      }
    }

    // Fetch updated coaching with all relations
    const finalCoaching = await prisma.coaching.findUnique({
      where: { coachingId },
      include: {
        profiles: {
          include: {
            courses: true,
            teachers: true,
          },
        },
      },
    });

    return NextResponse.json(finalCoaching);
  } catch (error) {
    console.error('Error updating coaching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/coaching/[id] - Delete coaching (optional)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const coachingId = id;

    // First, verify the coaching exists and belongs to the user
    const existingCoaching = await prisma.coaching.findUnique({
      where: { coachingId },
    });

    if (!existingCoaching) {
      return NextResponse.json({ error: 'Coaching not found' }, { status: 404 });
    }

    if (existingCoaching.ownerUserId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }    // Delete coaching (with manual cascade)
    await prisma.$transaction(async (tx) => {
      // Get all profiles for this coaching
      const profiles = await tx.coachingProfile.findMany({
        where: { coachingId: existingCoaching.id },
        select: { id: true }
      });

      // Delete all teachers for each profile
      for (const profile of profiles) {
        await tx.teacher.deleteMany({
          where: { profileId: profile.id }
        });
        
        await tx.course.deleteMany({
          where: { profileId: profile.id }
        });
      }

      // Delete all profiles
      await tx.coachingProfile.deleteMany({
        where: { coachingId: existingCoaching.id }
      });

      // Delete reviews
      await tx.review.deleteMany({
        where: { coachingId: existingCoaching.id }
      });

      // Finally delete the coaching
      await tx.coaching.delete({
        where: { coachingId },
      });
    });

    return NextResponse.json({ message: 'Coaching deleted successfully' });
  } catch (error) {
    console.error('Error deleting coaching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
