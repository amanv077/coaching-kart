import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch demo sessions for a coaching profile
export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileId } = params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'Scheduled';

    const demoSessions = await prisma.demoSession.findMany({
      where: {
        profileId,
        status: status as any,
      },
      include: {        course: {
          select: {
            id: true,
            courseName: true,
            courseDescription: true,
          }
        },
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
              }
            }
          }
        },        profile: {
          include: {
            coaching: {
              select: {
                organizationName: true,
              }
            }
          }
        }
      },      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ demoSessions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching demo sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo sessions' },
      { status: 500 }
    );
  }
}

// POST: Create a new demo session slot
export async function POST(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileId } = params;    const {
      courseId,
      title,
      description,
      availableDates,
      timeSlots,
      demoDays,
      maxParticipants,
      instructor,
      subjects,
      topics,
      demoAddress,
      landmark,
      isFree,
      price,
    } = await request.json();

    // Validate required fields
    if (!courseId || !title || !availableDates || !timeSlots || !instructor || !demoAddress || !subjects) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, title, availableDates, timeSlots, instructor, demoAddress, subjects' },
        { status: 400 }
      );
    }

    // Verify user owns this coaching profile
    const profile = await prisma.coachingProfile.findFirst({
      where: {
        id: profileId,
        coaching: {
          ownerUserId: session.user.id,
        }
      }
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Coaching profile not found or unauthorized' },
        { status: 404 }
      );
    }    // Create demo session using raw query to handle enum types
    const demoSessionId = crypto.randomUUID();
    const sessionId = `DS${Date.now()}`;
    
    await prisma.$executeRaw`
      INSERT INTO demo_sessions (
        id, "sessionId", "profileId", "courseId", title, description, mode,
        "availableDates", "timeSlots", "demoDays", "maxParticipants", instructor,
        subjects, topics, "demoAddress", landmark, "isFree", price, status, "createdAt", "updatedAt"
      ) VALUES (
        ${demoSessionId}, ${sessionId}, ${profileId}, ${courseId}, ${title}, ${description || ''}, 'offline',
        ${JSON.stringify(Array.isArray(availableDates) ? availableDates : [availableDates])},
        ${JSON.stringify(Array.isArray(timeSlots) ? timeSlots : [timeSlots])},
        ${parseInt(demoDays) || 1}, ${parseInt(maxParticipants) || 5}, ${instructor},
        ${JSON.stringify(Array.isArray(subjects) ? subjects : [subjects])},
        ${JSON.stringify(topics || [])}, ${demoAddress}, ${landmark || ''},
        ${isFree !== false}, ${isFree === false ? parseFloat(price) || 0 : 0}, 'Scheduled', NOW(), NOW()
      )
    `;

    // Fetch the created demo session
    const demoSession = await prisma.demoSession.findUnique({
      where: { id: demoSessionId },
      include: {
        course: {
          select: {
            courseName: true,
          }
        },
        profile: {
          include: {
            coaching: {
              select: {
                organizationName: true,
              }
            }
          }
        }      }
    });

    return NextResponse.json(
      { 
        message: 'Demo session created successfully',
        demoSession 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating demo session:', error);
    return NextResponse.json(
      { error: 'Failed to create demo session' },
      { status: 500 }
    );
  }
}
