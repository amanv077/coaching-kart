import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// PUT: Update demo session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;
    const updateData = await request.json();

    // Verify user owns this demo session
    const demoSession = await prisma.demoSession.findFirst({
      where: {
        id: sessionId,
        profile: {
          coaching: {
            ownerUserId: session.user.id,
          },
        },
      },
    });

    if (!demoSession) {
      return NextResponse.json(
        { error: "Demo session not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedSession = await prisma.demoSession.update({
      where: { id: sessionId },
      data: {
        ...updateData,
        dateTime: updateData.dateTime
          ? new Date(updateData.dateTime)
          : undefined,
        durationMinutes: updateData.durationMinutes
          ? parseInt(updateData.durationMinutes)
          : undefined,
        maxParticipants: updateData.maxParticipants
          ? parseInt(updateData.maxParticipants)
          : undefined,
      },
      include: {
        course: {
          select: {
            id: true,
            courseName: true,
          },
        },
        profile: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Demo session updated successfully",
        demoSession: updatedSession,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating demo session:", error);
    return NextResponse.json(
      { error: "Failed to update demo session" },
      { status: 500 }
    );
  }
}

// DELETE: Delete demo session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    // Verify user owns this demo session
    const demoSession = await prisma.demoSession.findFirst({
      where: {
        id: sessionId,
        profile: {
          coaching: {
            ownerUserId: session.user.id,
          },
        },
      },
    });

    if (!demoSession) {
      return NextResponse.json(
        { error: "Demo session not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete all bookings first
    await prisma.demoSessionBooking.deleteMany({
      where: { sessionId },
    });

    // Delete the session
    await prisma.demoSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json(
      { message: "Demo session deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting demo session:", error);
    return NextResponse.json(
      { error: "Failed to delete demo session" },
      { status: 500 }
    );
  }
}
