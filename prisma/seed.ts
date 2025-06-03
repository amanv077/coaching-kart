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
  });  if (coachUser) {
    // Create a coaching center (organization)
    const coaching = await prisma.coaching.upsert({
      where: { coachingId: 'sarahcoaching' },
      update: {},
      create: {
        coachingId: 'sarahcoaching',
        organizationName: 'Sarah\'s Excellence Academy',
        ownerName: 'Sarah Coach',
        ownerEmail: 'coach@demo.com',
        ownerPhone: '+91-9876543211',
        businessType: 'Individual',
        gstNumber: 'GST123456789',
        panNumber: 'ABCDE1234F',
        approved: true,
        ownerUserId: coachUser.id,
      },
    });

    console.log(`Created coaching: ${coaching.organizationName}`);

    // Create a coaching profile (branch) under the coaching
    const coachingProfile = await prisma.coachingProfile.upsert({
      where: { profileId: 'sarahprofile' },
      update: {},
      create: {
        profileId: 'sarahprofile',
        name: 'Sarah\'s Excellence Academy - Main Branch',
        branchName: 'Main Branch',
        establishedYear: 2018,
        tagline: 'Excellence in Education',
        description: 'Premier coaching center for JEE and NEET preparation with experienced faculty and proven track record.',
        logo: 'https://res.cloudinary.com/dwvifkvqi/image/upload/v1/coaching-logos/default-logo.png',
        images: [
          'https://res.cloudinary.com/dwvifkvqi/image/upload/v1/coaching-images/classroom1.jpg',
          'https://res.cloudinary.com/dwvifkvqi/image/upload/v1/coaching-images/library.jpg'
        ],
        
        // Location details
        address: '123 Education Street, MG Road',
        landmark: 'Near City Center Mall',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        
        // Contact details
        contactNumber: '+91-9876543211',
        alternateNumber: '+91-9876543212',
        email: 'contact@sarahsacademy.com',
        website: 'https://sarahsacademy.com',
        
        // Social media
        facebookUrl: 'https://facebook.com/sarahsacademy',
        instagramUrl: 'https://instagram.com/sarahsacademy',
        youtubeUrl: 'https://youtube.com/sarahsacademy',
        
        // Operating details
        operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        operatingHours: '8:00 AM - 8:00 PM',
        facilities: ['Air Conditioned Classrooms', 'Library', 'Computer Lab', 'Test Series', 'Study Material'],
        
        // Teaching details
        totalTeachers: 5,
        subjectsOffered: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
        examsOffered: ['JEE Main', 'JEE Advanced', 'NEET', 'Board Exams'],
          // Status
        approved: true,
        verificationStatus: 'Verified' as any,
        
        // Link to parent coaching
        coachingId: coaching.id,
      },
    });

    console.log(`Created coaching profile: ${coachingProfile.name}`);

    // Create sample courses
    const courses = [
      {
        courseName: 'Advanced Mathematics - JEE Preparation',
        courseDuration: '6 months',
        courseDescription: 'Comprehensive JEE Mathematics preparation with advanced problem-solving techniques',
        courseAmount: 15000,
        courseDiscount: 2000,
        courseMRP: 17000,
        subjects: ['Calculus', 'Algebra', 'Geometry', 'Trigonometry'],
        image: 'https://res.cloudinary.com/dwvifkvqi/image/upload/v1/course-images/math-course.jpg',        examsPrepared: ['JEE Main', 'JEE Advanced'],
        classLevel: 'Class 12',
        courseType: 'Regular' as any,
        mode: 'Both' as any,
        batchSize: 30,
        totalSeats: 30,
        availableSeats: 25,
        schedule: 'Mon-Fri 10:00 AM - 12:00 PM',
        features: ['Weekly Tests', 'Study Material', 'Doubt Clearing Sessions', 'Mock Tests'],
      },
      {
        courseName: 'Physics Fundamentals - NEET/JEE',
        courseDuration: '8 months',
        courseDescription: 'Master physics concepts for NEET and JEE with practical applications',
        courseAmount: 18000,
        courseDiscount: 3000,
        courseMRP: 21000,
        subjects: ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism'],
        image: 'https://res.cloudinary.com/dwvifkvqi/image/upload/v1/course-images/physics-course.jpg',        examsPrepared: ['NEET', 'JEE Main', 'JEE Advanced'],
        classLevel: 'Class 11-12',
        courseType: 'Regular' as any,
        mode: 'Both' as any,
        batchSize: 25,
        totalSeats: 25,
        availableSeats: 20,
        schedule: 'Mon-Fri 2:00 PM - 4:00 PM',
        features: ['Lab Sessions', 'Conceptual Videos', 'Formula Bank', 'Previous Year Papers'],
      },
      {
        courseName: 'Chemistry Complete Course',
        courseDuration: '7 months',
        courseDescription: 'Complete chemistry course covering organic, inorganic, and physical chemistry',
        courseAmount: 16000,
        courseDiscount: 2500,
        courseMRP: 18500,
        subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
        image: 'https://res.cloudinary.com/dwvifkvqi/image/upload/v1/course-images/chemistry-course.jpg',        examsPrepared: ['NEET', 'JEE Main'],
        classLevel: 'Class 11-12',
        courseType: 'Regular' as any,
        mode: 'Offline' as any,
        batchSize: 20,
        totalSeats: 20,
        availableSeats: 18,
        schedule: 'Tue-Thu-Sat 4:00 PM - 6:00 PM',
        features: ['Practical Sessions', 'Reaction Mechanisms', 'Memory Techniques', 'Quick Revision'],
      },
    ];

    for (const courseData of courses) {
      const course = await prisma.course.upsert({
        where: { 
          profileId_courseName: {
            profileId: coachingProfile.id,
            courseName: courseData.courseName
          }
        },
        update: {},
        create: {
          ...courseData,
          profileId: coachingProfile.id,
        },
      });

      console.log(`Created course: ${course.courseName} - ₹${course.courseAmount}`);
    }    // Create demo sessions for the first course
    const firstCourse = await prisma.course.findFirst({
      where: { profileId: coachingProfile.id }
    });

    if (firstCourse) {
      const demoSession = await prisma.demoSession.create({
        data: {
          profileId: coachingProfile.id,
          courseId: firstCourse.id,
          title: 'Free Mathematics Demo Class - JEE Preparation',
          description: 'Join our free demo class to experience our teaching methodology and get a taste of our comprehensive JEE Mathematics preparation course.',          mode: 'online' as any,
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          durationMinutes: 60,
          maxParticipants: 50,
          meetingLink: 'https://meet.google.com/demo-math-class',
          instructor: 'Sarah Coach',
          topics: ['Differential Calculus', 'Integration Basics', 'Problem Solving Techniques'],
          status: 'Scheduled' as any,
        }
      });

      console.log(`Created demo session: ${demoSession.title}`);
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
