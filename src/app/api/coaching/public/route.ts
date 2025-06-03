import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const searchQuery = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const subjects = searchParams.get('subjects')?.split(',').filter(Boolean) || [];
    const exams = searchParams.get('exams')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause for filtering
    const whereClause: any = {
      approved: true, // Only show approved coachings
      profiles: {
        some: {
          approved: true, // Only show approved profiles
          isActive: true,
        },
      },
    };

    // Add search filters
    if (searchQuery) {
      whereClause.OR = [
        {
          organizationName: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        {
          profiles: {
            some: {
              OR: [
                {
                  name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: searchQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  subjectsOffered: {
                    hasSome: [searchQuery],
                  },
                },
              ],
            },
          },
        },
      ];
    }

    // Add location filter
    if (location) {
      whereClause.profiles.some.OR = whereClause.profiles.some.OR || [];
      whereClause.profiles.some.OR.push(
        {
          city: {
            contains: location,
            mode: 'insensitive',
          },
        },
        {
          state: {
            contains: location,
            mode: 'insensitive',
          },
        }
      );
    }

    // Add subjects filter
    if (subjects.length > 0) {
      whereClause.profiles.some.subjectsOffered = {
        hasSome: subjects,
      };
    }

    // Add exams filter
    if (exams.length > 0) {
      whereClause.profiles.some.examsOffered = {
        hasSome: exams,
      };
    }    // Fetch coachings with filters
    const coachings = await prisma.coaching.findMany({
      where: whereClause,
      include: {
        profiles: {
          where: {
            approved: true,
            isActive: true,
          },
          include: {            courses: {
              select: {
                id: true,
                courseName: true,
                courseAmount: true,
                courseDuration: true,
                rating: true,
                totalRatings: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: getOrderBy(sortBy),
    });    // Post-process sorting for rating if needed
    let sortedCoachings = coachings;
    if (sortBy === 'rating') {
      sortedCoachings = coachings.sort((a, b) => {
        // Get the highest rating from each coaching's courses
        const aMaxRating = Math.max(...(a.profiles?.flatMap((p: any) => p.courses?.map((c: any) => c.rating || 0) || []) || [0]));
        const bMaxRating = Math.max(...(b.profiles?.flatMap((p: any) => p.courses?.map((c: any) => c.rating || 0) || []) || [0]));
        return bMaxRating - aMaxRating; // Descending order
      });
    }

    // Get total count for pagination
    const totalCount = await prisma.coaching.count({
      where: whereClause,
    });

    // Transform data to match frontend expectations
    const transformedCoachings = sortedCoachings.map(coaching => ({
      id: coaching.id,
      coachingId: coaching.coachingId,
      organizationName: coaching.organizationName,
      approved: coaching.approved,
      isActive: coaching.isActive,
      profiles: coaching.profiles.map(profile => ({
        id: profile.id,
        profileId: profile.profileId,
        name: profile.name,
        branchName: profile.branchName,
        city: profile.city,
        state: profile.state,
        logo: profile.logo,
        images: profile.images,        tagline: profile.tagline,
        description: profile.description,
        establishedYear: profile.establishedYear,
        contactNumber: profile.contactNumber,
        email: profile.email,
        approved: profile.approved,
        isActive: profile.isActive,
        verificationStatus: profile.verificationStatus,
        address: profile.address,
        landmark: profile.landmark,
        pincode: profile.pincode,
        alternateNumber: profile.alternateNumber,
        website: profile.website,
        subjectsOffered: profile.subjectsOffered,
        examsOffered: profile.examsOffered,
        facilities: profile.facilities,
        operatingDays: profile.operatingDays,
        operatingHours: profile.operatingHours,
        courses: profile.courses,
      })),
    }));

    return NextResponse.json({
      coachings: transformedCoachings,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching public coachings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getOrderBy(sortBy: string) {
  switch (sortBy) {
    case 'rating':
      // For rating, we'll sort by createdAt desc and handle rating in post-processing
      return { createdAt: 'desc' as const };
    case 'newest':
      return { createdAt: 'desc' as const };
    case 'oldest':
      return { createdAt: 'asc' as const };
    case 'name':
      return { organizationName: 'asc' as const };
    default:
      // Featured/relevance - put approved first, then by creation date
      return [
        { approved: 'desc' as const },
        { createdAt: 'desc' as const },
      ];
  }
}
