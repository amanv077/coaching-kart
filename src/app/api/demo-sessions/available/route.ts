import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch all available demo sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const mode = searchParams.get('mode');
    const course = searchParams.get('course');

    // Build where clause
    const where: any = {
      status: "Scheduled",
    };

    // Add filters if provided
    if (city) {
      where.profile = {
        city: city,
      };
    }

    if (mode && mode !== "all") {
      where.mode = mode;
    }

    const demoSessions = await prisma.demoSession.findMany({
      where,
      include: {
        course: {
          select: {
            courseName: true,
          },
        },
        profile: {
          select: {
            name: true,
            city: true,
            state: true,
            coaching: {
              select: {
                organizationName: true,
              },
            },
          },
        },
        bookings: {
          where: {
            status: { in: ["pending", "confirmed"] },
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter by course if provided
    let filteredSessions = demoSessions;
    if (course && course !== "all") {
      filteredSessions = demoSessions.filter(
        (session) => session.course.courseName === course
      );
    }

    // Filter out sessions with no future available dates
    const today = new Date().toISOString().split("T")[0];
    filteredSessions = filteredSessions.filter((session) => {
      const futureDates = session.availableDates.filter(
        (date: string) => date >= today
      );
      return futureDates.length > 0;
    });

    return NextResponse.json({ 
      demoSessions: filteredSessions 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching available demo sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo sessions' },
      { status: 500 }
    );
  }
}
