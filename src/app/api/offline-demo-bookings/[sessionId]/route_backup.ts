import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST: Book an offline demo session
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;
    
    const {
      selectedDate,
      selectedTime,
      selectedSubject,
      studentName,
      studentPhone,
      studentEmail,
      specialRequest
    } = await request.json();

    // Validate required fields
    if (!selectedDate || !selectedTime || !selectedSubject) {
      return NextResponse.json(
        { error: 'Missing required fields: selectedDate, selectedTime, selectedSubject' },
        { status: 400 }
      );
    }

    // Check if session exists and is available
    const demoSession = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: {
        bookings: {
          where: {
            status: { in: ['pending', 'confirmed'] },
            selectedDate: selectedDate,
            selectedTime: selectedTime,
          }
        },
        profile: {
          select: {
            name: true,
            contactNumber: true,
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
    }    // Check if the selected time slot is available
    const conflictingBookings = demoSession.bookings || [];
    if (conflictingBookings.length >= demoSession.maxParticipants) {
      return NextResponse.json(
        { error: 'This time slot is fully booked' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.demoSessionBooking.create({
      data: {
        userId: session.user.id,
        sessionId: sessionId,
        selectedDate,
        selectedTime,
        selectedSubject,
        studentName: studentName || session.user.name || '',
        studentPhone: studentPhone || '',
        studentEmail: studentEmail || session.user.email || '',
        specialRequest,
        status: 'pending' as const, // Offline demos start as pending for coaching approval
      },
      select: {
        id: true,
        status: true,
        selectedDate: true,
        selectedTime: true,
        selectedSubject: true,
        bookedAt: true,
      }
    });

    return NextResponse.json(
      { 
        message: 'Demo session booking request submitted successfully. The coaching center will confirm your booking soon.',
        booking: {
          id: booking.id,
          status: booking.status,
          selectedDate: booking.selectedDate,
          selectedTime: booking.selectedTime,
          selectedSubject: booking.selectedSubject,
          bookedAt: booking.bookedAt,
          demoAddress: (demoSession as any).demoAddress,
          organizationName: (demoSession as any).profile?.coaching?.organizationName,
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
          include: {
            profile: {
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
