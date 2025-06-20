import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// PUT: Update booking status (cancel, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId } = params;
    const { status, feedback, rating } = await request.json();

    // Verify user owns this booking
    const booking = await prisma.demoSessionBooking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedBooking = await prisma.demoSessionBooking.update({
      where: { id: bookingId },
      data: {
        ...(status && { status }),
        ...(feedback && { feedback }),
        ...(rating && { rating: parseInt(rating) }),
      },
      include: {
        session: {
          include: {
            profile: {
              select: {
                name: true,
                coaching: {
                  select: {
                    organizationName: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'Booking updated successfully',
        booking: updatedBooking 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE: Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId } = params;

    // Verify user owns this booking
    const booking = await prisma.demoSessionBooking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update status to cancelled instead of deleting
    await prisma.demoSessionBooking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    });

    return NextResponse.json(
      { message: 'Booking cancelled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
