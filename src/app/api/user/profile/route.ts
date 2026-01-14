import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        roles: true,
        bio: true,
        interests: true,
        learningGoals: true,
        coachingMode: true,
        studyLevel: true,
        preferredSubjects: true,
        targetExams: true,
        preferredCities: true,
        maxTravelDistance: true,
        sessionTimings: true,
        budgetRange: true,
        transportMode: true,
        batchSize: true,
        city: true,
        classLevel: true,
        age: true,
        schoolOrCollege: true,
        lookingFor: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
