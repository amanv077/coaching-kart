import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create demo users with different roles
  const users = [
    {
      name: 'John Student',
      email: 'student@demo.com',
      password: 'password123',
      role: 'STUDENT',
      phoneNumber: '+91-9876543210',
      city: 'Mumbai',
      classLevel: '12th Grade',
      age: 17,
      schoolOrCollege: 'Delhi Public School',
      lookingFor: 'Both',
    },
    {
      name: 'Sarah Coach',
      email: 'coach@demo.com', 
      password: 'password123',
      role: 'COACH',
      phoneNumber: '+91-9876543211',
      city: 'Bangalore',
      age: 32,
      schoolOrCollege: 'IIT Delhi',
      lookingFor: 'Both',
    },
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'password123', 
      role: 'ADMIN',
      phoneNumber: '+91-9876543212',
      city: 'Delhi',
      age: 35,
      lookingFor: 'Both',
    },
  ];

  // Create users with transaction
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    await prisma.$transaction(async (tx: any) => {
      // Check if user already exists
      const existingUser = await tx.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        // Create user
        const user = await tx.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            phoneNumber: userData.phoneNumber,
            city: userData.city,
            classLevel: userData.classLevel,
            age: userData.age,
            schoolOrCollege: userData.schoolOrCollege,
            lookingFor: userData.lookingFor as any,
            emailVerified: new Date(),
          },
        });

        // Create user role
        await tx.userRole.create({
          data: {
            userId: user.id,
            role: userData.role as any,
          }
        });

        console.log(`Created user: ${user.name} (${userData.role}) - ${user.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    });
  }

  // Get coach user for creating coaching and courses
  const coachUser = await prisma.user.findFirst({
    where: { 
      email: 'coach@demo.com'
    }
  });

  if (coachUser) {
    // Create a coaching center
    const coaching = await prisma.coaching.upsert({
      where: { email: 'sarahcoaching@demo.com' },
      update: {},
      create: {
        coachingName: 'Sarah\'s Excellence Academy',
        contactNumber: '+91-9876543211',
        alternateNumber: '+91-9876543213',
        address: '123 Education Street, Koramangala',
        city: 'Bangalore',
        pincode: '560034',
        landmark: 'Near Forum Mall',
        email: 'sarahcoaching@demo.com',
        images: [
          'https://example.com/coaching1.jpg',
          'https://example.com/coaching2.jpg'
        ],
        approved: true,
        ownerUserId: coachUser.id,
      },
    });

    console.log(`Created coaching: ${coaching.coachingName}`);

    // Create sample courses
    const courses = [
      {
        courseName: 'Advanced Mathematics - JEE Preparation',
        courseDuration: '6 months',
        courseDescription: 'Comprehensive JEE Mathematics preparation with advanced problem-solving techniques',
        courseAmount: 15000,
        courseDiscount: 2000,
        courseMRP: 17000,
        courseTeacher: 'Sarah Coach',
        subjects: ['Calculus', 'Algebra', 'Geometry', 'Trigonometry'],
        image: 'https://example.com/math-course.jpg',
      },
      {
        courseName: 'Physics Fundamentals - NEET/JEE',
        courseDuration: '8 months',
        courseDescription: 'Master physics concepts for NEET and JEE with practical applications',
        courseAmount: 18000,
        courseDiscount: 3000,
        courseMRP: 21000,
        courseTeacher: 'Sarah Coach',
        subjects: ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism'],
        image: 'https://example.com/physics-course.jpg',
      },
      {
        courseName: 'Chemistry Complete Course',
        courseDuration: '7 months',
        courseDescription: 'Complete chemistry course covering organic, inorganic, and physical chemistry',
        courseAmount: 16000,
        courseDiscount: 2500,
        courseMRP: 18500,
        courseTeacher: 'Sarah Coach',
        subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
        image: 'https://example.com/chemistry-course.jpg',
      },
    ];

    for (const courseData of courses) {
      const course = await prisma.course.upsert({
        where: { 
          coachingId_courseName: {
            coachingId: coaching.id,
            courseName: courseData.courseName
          }
        },
        update: {},
        create: {
          ...courseData,
          coachingId: coaching.id,
        },
      });

      console.log(`Created course: ${course.courseName} - ₹${course.courseAmount}`);
    }

    // Create demo sessions for the first course
    const firstCourse = await prisma.course.findFirst({
      where: { coachingId: coaching.id }
    });

    if (firstCourse) {
      const demoSession = await prisma.demoSession.create({
        data: {
          coachingId: coaching.id,
          courseId: firstCourse.id,
          mode: 'online',
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          durationMinutes: 60,
        }
      });

      console.log(`Created demo session for course: ${firstCourse.courseName}`);
    }
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
