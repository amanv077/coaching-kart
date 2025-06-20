import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET: Get user's demo bookings
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
