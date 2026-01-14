import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { sendDemoBookingEmail } from '@/lib/email';

// PUT: Update booking status (accept/reject by coaching owner)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await params;
    const body = await request.json();
    const { status, rejectionReason } = body;

    // Validate status
    if (!["confirmed", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "confirmed" or "rejected"' },
        { status: 400 }
      );
    }

    // Get the booking with all related data
    const booking = await prisma.demoSessionBooking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        session: {
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
                    ownerUserId: true,
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
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    } // Check if the current user is the owner of the coaching profile
    if (
      (booking as any).session.profile.coaching.ownerUserId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You can only manage bookings for your own coaching profile" },
        { status: 403 }
      );
    }

    // Update the booking status    // Update booking status using raw query
    await prisma.$executeRaw`
      UPDATE demo_session_bookings 
      SET status = ${status}, "updatedAt" = NOW()
      WHERE id = ${bookingId}
    `;

    // Fetch updated booking with relations
    const updatedBooking = await prisma.demoSessionBooking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        session: {
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
    });

    if (!updatedBooking) {
      return NextResponse.json(
        { error: "Failed to fetch updated booking" },
        { status: 500 }
      );
    }

    // Send confirmation email if booking is confirmed
    if (status === "confirmed") {
      try {
        const emailSent = await sendDemoBookingEmail(
          (updatedBooking as any).user.email,
          (updatedBooking as any).user.name || "Student",
          {
            sessionTitle: `Demo Session - ${
              (updatedBooking as any).session.course.courseName
            }`,
            courseName: (updatedBooking as any).session.course.courseName,
            organizationName:
              (updatedBooking as any).session.profile.coaching
                ?.organizationName || "Coaching Center",
            dateTime: new Date(
              (updatedBooking as any).selectedDate +
                "T" +
                (updatedBooking as any).selectedTime
            ),
            duration: 60,
            mode: (updatedBooking as any).session.mode,
            location:
              (updatedBooking as any).session.mode === "offline"
                ? (updatedBooking as any).session.demoAddress
                : null,
            meetingLink: null,
            contactNumber: (updatedBooking as any).session.profile
              .contactNumber,
            address: (updatedBooking as any).session.profile.address,
            city: (updatedBooking as any).session.profile.city,
            state: (updatedBooking as any).session.profile.state,
          }
        );

        if (!emailSent) {
          console.error("Failed to send confirmation email");
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      message: `Booking ${status} successfully`,
      booking: updatedBooking,
      emailSent: status === "confirmed",
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
