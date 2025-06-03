const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCoachingAPI() {
  try {
    console.log('Testing coaching data fetch with profiles and courses...\n');
    
    // This simulates what the API does
    const coachings = await prisma.coaching.findMany({
      include: {
        profiles: {
          include: {
            courses: {
              select: {
                id: true,
                courseName: true,
                courseAmount: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${coachings.length} coaching(s)`);
    
    coachings.forEach((coaching, index) => {
      console.log(`\n--- Coaching ${index + 1} ---`);
      console.log(`Organization: ${coaching.organizationName}`);
      console.log(`Profiles: ${coaching.profiles ? coaching.profiles.length : 0}`);
      
      if (coaching.profiles && coaching.profiles.length > 0) {
        coaching.profiles.forEach((profile, profileIndex) => {
          console.log(`  Profile ${profileIndex + 1}: ${profile.name}`);
          console.log(`    Courses: ${profile.courses ? profile.courses.length : 0}`);
          if (profile.courses && profile.courses.length > 0) {
            profile.courses.forEach(course => {
              console.log(`      - ${course.courseName}: ₹${course.courseAmount}`);
            });
          }
        });
      } else {
        console.log('  No profiles found - this would trigger the fallback UI');
      }
    });

    // Calculate stats like the API does
    const totalProfiles = coachings.reduce((acc, coaching) => acc + (coaching.profiles ? coaching.profiles.length : 0), 0);
    const totalCourses = coachings.reduce((acc, coaching) => 
      acc + (coaching.profiles ? coaching.profiles.reduce((profileAcc, profile) => profileAcc + (profile.courses ? profile.courses.length : 0), 0) : 0), 0);
    const pendingApprovals = coachings.filter(coaching => !coaching.approved).length;

    console.log('\n--- Stats ---');
    console.log(`Total Coachings: ${coachings.length}`);
    console.log(`Total Profiles: ${totalProfiles}`);
    console.log(`Total Courses: ${totalCourses}`);
    console.log(`Pending Approvals: ${pendingApprovals}`);

    console.log('\n✅ API data structure test completed successfully!');
    console.log('The coaching.profiles[0] error should now be resolved.');
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCoachingAPI();
