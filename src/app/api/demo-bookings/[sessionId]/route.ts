import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { sendDemoBookingEmail } from '@/lib/email';

// POST: Book a demo session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;
    const {
      selectedDate,
      selectedTime,
      selectedSubject,
      studentName,
      studentPhone,
      studentEmail,
      specialRequest,
    } = await request.json();

    // Validate required fields
    if (!selectedDate || !selectedTime || !selectedSubject) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: selectedDate, selectedTime, selectedSubject",
        },
        { status: 400 }
      );
    }

    // Check if session exists and is available
    const demoSession = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: {
        bookings: {
          where: {
            status: { in: ["pending", "confirmed"] },
          },
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
              },
            },
          },
        },
        course: {
          select: {
            courseName: true,
          },
        },
      },
    });

    if (!demoSession) {
      return NextResponse.json(
        { error: "Demo session not found" },
        { status: 404 }
      );
    }

    if (demoSession.status !== "Scheduled") {
      return NextResponse.json(
        { error: "Demo session is not available for booking" },
        { status: 400 }
      );
    }

    // Check if user already booked this session
    const existingBooking = await prisma.demoSessionBooking.findFirst({
      where: {
        userId: session.user.id,
        sessionId: sessionId,
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "You have already booked this demo session" },
        { status: 400 }
      );
    }

    // Check if the selected time slot is available
    const conflictingBookings = demoSession.bookings.filter(
      (booking: any) =>
        booking.selectedDate === selectedDate &&
        booking.selectedTime === selectedTime
    );

    if (conflictingBookings.length >= demoSession.maxParticipants) {
      return NextResponse.json(
        { error: "This time slot is fully booked" },
        { status: 400 }
      );
    }

    // Create booking using raw query to handle enum types
    const bookingId = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO demo_session_bookings (
        id, "userId", "sessionId", "selectedDate", "selectedTime", "selectedSubject",
        "studentName", "studentPhone", "studentEmail", "specialRequest", status, "bookedAt"
      ) VALUES (
        ${bookingId}, ${
      session.user.id
    }, ${sessionId}, ${selectedDate}, ${selectedTime}, ${selectedSubject},
        ${studentName || session.user.name || ""}, ${studentPhone || ""}, ${
      studentEmail || session.user.email || ""
    }, 
        ${specialRequest || ""}, 'confirmed', NOW()
      )
    `;

    // Fetch the created booking with user info
    const booking = await prisma.demoSessionBooking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    try {
      await sendDemoBookingEmail(booking.user.email, booking.user.name, {
        sessionTitle: demoSession.title,
        courseName: demoSession.course.courseName || "",
        organizationName:
          demoSession.profile.coaching.organizationName ||
          demoSession.profile.name ||
          "",
        dateTime: new Date(`${selectedDate}T${selectedTime.split("-")[0]}`),
        duration: 60, // Default duration
        mode: demoSession.mode,
        location: demoSession.demoAddress,
        meetingLink: null,
        contactNumber: demoSession.profile.contactNumber || null,
        address: demoSession.profile.address || null,
        city: demoSession.profile.city || null,
        state: demoSession.profile.state || null,
      });
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json(
      {
        message: "Demo session booked successfully",
        booking: {
          id: booking.id,
          status: booking.status,
          bookedAt: booking.bookedAt,
          selectedDate: (booking as any).selectedDate,
          selectedTime: (booking as any).selectedTime,
          selectedSubject: (booking as any).selectedSubject,
          session: {
            title: demoSession.title,
            demoAddress: demoSession.demoAddress,
            mode: demoSession.mode,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error booking demo session:", error);
    return NextResponse.json(
      { error: "Failed to book demo session" },
      { status: 500 }
    );
  }
}

// GET: Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
                  },
                },
              },
            },
            course: {
              select: {
                courseName: true,
              },
            },
          },
        },
      },
      orderBy: {
        bookedAt: "desc",
      },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
