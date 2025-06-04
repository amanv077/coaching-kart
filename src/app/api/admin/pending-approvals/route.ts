import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has ADMIN role
    const userRoles = session.user?.roles || [session.user?.role];
    const hasAdminRole = userRoles.includes('ADMIN');
    
    if (!hasAdminRole) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get pending coaching profiles
    const pendingProfiles = await prisma.coachingProfile.findMany({
      where: {
        approved: false,
        verificationStatus: 'Pending'
      },
      include: {
        coaching: {
          select: {
            organizationName: true,
            ownerName: true,
            ownerEmail: true,
            businessType: true
          }
        },
        courses: {
          select: {
            id: true,
            courseName: true,
            courseAmount: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc' // Oldest first
      }
    });

    // Transform data for frontend
    const transformedProfiles = pendingProfiles.map(profile => ({
      id: profile.id,
      profileId: profile.profileId,
      name: profile.name,
      branchName: profile.branchName,
      establishedYear: profile.establishedYear,
      tagline: profile.tagline,
      description: profile.description,
      logo: profile.logo,
      images: profile.images,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      contactNumber: profile.contactNumber,
      email: profile.email,
      subjectsOffered: profile.subjectsOffered,
      examsOffered: profile.examsOffered,
      facilities: profile.facilities,
      coaching: profile.coaching,
      courses: profile.courses,
      createdAt: profile.createdAt.toISOString()
    }));

    return NextResponse.json({ 
      pendingProfiles: transformedProfiles,
      count: transformedProfiles.length 
    });

  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    // Check if user has ADMIN role
    const userRoles = session.user?.roles || [session.user?.role];
    const hasAdminRole = userRoles.includes('ADMIN');
    
    if (!hasAdminRole) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { profileId, action } = await request.json();

    if (!profileId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Find the coaching profile first
    const profile = await prisma.coachingProfile.findUnique({
      where: { profileId: profileId }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Coaching profile not found' }, { status: 404 });
    }

    // Update the coaching profile
    const updatedProfile = await prisma.coachingProfile.update({
      where: { profileId: profileId },
      data: {
        approved: action === 'approve',
        verificationStatus: action === 'approve' ? 'Verified' : 'Rejected'
      }
    });

    // If approved, also approve the parent coaching
    if (action === 'approve') {
      await prisma.coaching.update({
        where: { id: updatedProfile.coachingId },
        data: { approved: true }
      });
    }

    return NextResponse.json({ 
      message: `Coaching profile ${action}d successfully`,
      profile: updatedProfile 
    });

  } catch (error) {
    console.error('Error updating coaching approval:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
