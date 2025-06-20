import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { sendDemoBookingEmail } from '@/lib/email';

// POST: Book a demo session
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;    // Check if session exists and is available
    const demoSession = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: {
        bookings: {
          where: {
            status: 'confirmed'
          }
        },
        profile: {
          select: {
            name: true,
            contactNumber: true,
            address: true,
            city: true,
            state: true,
            coaching: {
              select: {
                organizationName: true,
              }
            }
          }
        },
        course: {
          select: {
            courseName: true,
          }
        }
      }
    });

    if (!demoSession) {
      return NextResponse.json(
        { error: 'Demo session not found' },
        { status: 404 }
      );
    }

    if (demoSession.status !== 'Scheduled') {
      return NextResponse.json(
        { error: 'Demo session is not available for booking' },
        { status: 400 }
      );
    }

    // Check if user already booked this session
    const existingBooking = await prisma.demoSessionBooking.findUnique({
      where: {
        userId_sessionId: {
          userId: session.user.id,
          sessionId: sessionId,
        }
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this demo session' },
        { status: 400 }
      );
    }

    // Check if session is full
    if (demoSession.bookings.length >= demoSession.maxParticipants) {
      return NextResponse.json(
        { error: 'Demo session is fully booked' },
        { status: 400 }
      );
    }    // Create booking
    const booking = await prisma.demoSessionBooking.create({
      data: {
        userId: session.user.id,
        sessionId: sessionId,
        status: 'confirmed',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          }
        }
      }
    });

    // Get the demo session details again with all includes for email
    const sessionForEmail = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: {
        profile: {
          select: {
            name: true,
            contactNumber: true,
            address: true,
            city: true,
            state: true,
            coaching: {
              select: {
                organizationName: true,
              }
            }
          }
        },
        course: {
          select: {
            courseName: true,
          }
        }
      }
    });

    // Send confirmation email to user
    try {
      await sendDemoBookingEmail(        booking.user.email,
        booking.user.name,
        {
          sessionTitle: demoSession.title,
          courseName: sessionForEmail?.course.courseName || '',
          organizationName: sessionForEmail?.profile.coaching.organizationName || sessionForEmail?.profile.name || '',
          dateTime: demoSession.dateTime,
          duration: demoSession.durationMinutes,
          mode: demoSession.mode,
          location: demoSession.location,
          meetingLink: demoSession.meetingLink,
          contactNumber: sessionForEmail?.profile.contactNumber || null,
          address: sessionForEmail?.profile.address || null,
          city: sessionForEmail?.profile.city || null,
          state: sessionForEmail?.profile.state || null,
        }
      );
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json(
      { 
        message: 'Demo session booked successfully',
        booking: {
          id: booking.id,
          status: booking.status,
          bookedAt: booking.bookedAt,
          session: {
            title: demoSession.title,
            dateTime: demoSession.dateTime,
            duration: demoSession.durationMinutes,
            mode: demoSession.mode,
          }
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error booking demo session:', error);
    return NextResponse.json(
      { error: 'Failed to book demo session' },
      { status: 500 }
    );
  }
}

// GET: Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await prisma.demoSessionBooking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        session: {
          include: {            profile: {
              select: {
                name: true,
                city: true,
                state: true,
                contactNumber: true,
                coaching: {
                  select: {
                    organizationName: true,
                  }
                }
              }
            },
            course: {
              select: {
                courseName: true,
              }
            }
          }
        }
      },
      orderBy: {
        bookedAt: 'desc',
      },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
