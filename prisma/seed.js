
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bhopalCoachings = [
  { name: "Aurous Academy", area: "MP Nagar" },
  { name: "Catalyst Institute", area: "Zone-II MP Nagar" },
  { name: "Momentum Classes", area: "Zone-I MP Nagar" },
  { name: "FIITJEE Bhopal", area: "Habibganj" },
  { name: "Allen Career Institute", area: "ISBT" },
  { name: "Aakash Institute", area: "MP Nagar" },
  { name: "Resonance", area: "Zone-II MP Nagar" },
  { name: "Motion Education", area: "MP Nagar" },
  { name: "Top Rankers", area: "Zone-II MP Nagar" },
  { name: "LegalEdge", area: "Zone-I MP Nagar" },
  { name: "Super 30 Bhopal", area: "New Market" },
  { name: "Bhopal Academy", area: "Arera Colony" },
  { name: "Mastermind Tutorials", area: "Kolar Road" },
  { name: "Target PMT", area: "MP Nagar" },
  { name: "Quantum Classes", area: "Indrapuri" },
  { name: "Scholars Den", area: "Awadhpuri" },
  { name: "Brainiacs", area: "Saket Nagar" },
  { name: "Elite Institute", area: "Ayodhya Bypass" },
  { name: "Success Point", area: "Jahangirabad" },
  { name: "Vision IAS", area: "MP Nagar" }
];

const indoreCoachings = [
  { name: "Kalpvriksha Institute", area: "Bhawarkua" },
  { name: "Kautilya Academy", area: "Bhawarkua" },
  { name: "Allen Indore", area: "Vijay Nagar" },
  { name: "Aakash Indore", area: "Geeta Bhawan" },
  { name: "Catalyser", area: "Vijay Nagar" },
  { name: "Motion Indore", area: "AB Road" },
  { name: "Resonance Indore", area: "South Tukoganj" },
  { name: "Unacademy Centre", area: "Bhawarkua" },
  { name: "Physics Wallah Vidyapeeth", area: "Bhawarkua" },
  { name: "Sharma Academy", area: "Bhawarkua" },
  { name: "PS Academy", area: "Bhawarkua" },
  { name: "MGICS", area: "Geeta Bhawan" },
  { name: "Brain Master", area: "Vijay Nagar" },
  { name: "Sigma Classes", area: "Annapurna" },
  { name: "Indore Institute", area: "Rajwada" },
  { name: "Rankers Point", area: "Geeta Bhawan" },
  { name: "The Vision", area: "Sapna Sangeeta" },
  { name: "Career Launcher", area: "AB Road" },
  { name: "IMS Indore", area: "New Palasia" },
  { name: "T.I.M.E.", area: "Bhawarkua" }
];

const coursesList = [
  { name: "JEE Mains + Advanced", amount: 120000, duration: "2 Years", subject: "PCM", exam: "JEE" },
  { name: "NEET Comprehensive", amount: 110000, duration: "2 Years", subject: "PCB", exam: "NEET" },
  { name: "Foundation Class 10", amount: 45000, duration: "1 Year", subject: "Science, Math", exam: "Board" },
  { name: "UPSC Prelims + Mains", amount: 150000, duration: "1.5 Years", subject: "General Studies", exam: "UPSC" },
  { name: "MPPSC Target Batch", amount: 80000, duration: "1 Year", subject: "General Studies", exam: "MPPSC" },
  { name: "CA Foundation", amount: 60000, duration: "6 Months", subject: "Accounts, Law", exam: "CA" },
  { name: "CLAT Achievers", amount: 90000, duration: "1 Year", subject: "Law, English", exam: "CLAT" },
  { name: "NDA Selection Batch", amount: 55000, duration: "1 Year", subject: "Math, GAT", exam: "NDA" },
  { name: "Bank PO Success", amount: 25000, duration: "6 Months", subject: "Quant, Reasoning", exam: "Bank PO" },
  { name: "SSC CGL Tier 1+2", amount: 30000, duration: "8 Months", subject: "Math, English", exam: "SSC" }
];

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.demoSessionBooking.deleteMany();
  await prisma.demoSession.deleteMany();
  await prisma.review.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.course.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.coachingProfile.deleteMany();
  await prisma.coaching.deleteMany();
  // Don't delete users to avoid breaking auth, or better delete non-admin users if valid
 
  // Create a default owner user if not exists (mock)
  const ownerEmail = "coaching_owner@example.com";
  let owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
  
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        name: "Coaching Owner",
        email: ownerEmail,
        password: "hashedpassword123", // In real app should be hashed
        roles: { create: { role: 'COACH' } }
      }
    });
  }

  const createCoaching = async (data, city) => {
    // Create Coaching
    const coaching = await prisma.coaching.create({
      data: {
        organizationName: data.name,
        ownerName: "Director " + data.name,
        ownerEmail: `contact@${data.name.toLowerCase().replace(/\s/g, '')}.com`,
        ownerPhone: "9876543210",
        approved: true,
        isActive: true,
        ownerUserId: owner.id,
        profiles: {
          create: {
            name: `${data.name} ${data.area}`,
            branchName: data.area,
            establishedYear: 2010 + Math.floor(Math.random() * 10),
            description: `Best coaching for competitive exams in ${city}. We provide top-notch study material and experienced faculty.`,
            logo: `https://ui-avatars.com/api/?name=${data.name.replace(/\s/g, '+')}&background=0F52BA&color=fff`,
            images: [
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
              "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80"
            ],
            address: `123, ${data.area}`,
            city: city,
            state: "Madhya Pradesh",
            pincode: city === "Bhopal" ? "462011" : "452001",
            contactNumber: "9876543210",
            email: `enquiry@${data.name.toLowerCase().replace(/\s/g, '')}.com`,
            operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            operatingHours: "09:00 AM - 08:00 PM",
            facilities: ["AC Classrooms", "Library", "Computer Lab", "Hostel"],
            subjectsOffered: ["Maths", "Physics", "Chemistry", "Biology"],
            examsOffered: ["JEE", "NEET", "Boards"],
            approved: true,
            isActive: true,
            verificationStatus: 'Verified',
            totalTeachers: 10 + Math.floor(Math.random() * 20)
          }
        }
      },
      include: { profiles: true }
    });

    const profile = coaching.profiles[0];

    // Create Courses for this profile
    const numCourses = 3 + Math.floor(Math.random() * 4); // 3 to 6 courses
    const uniqueCourses = [...coursesList].sort(() => 0.5 - Math.random()).slice(0, numCourses);

    for (const courseTemplate of uniqueCourses) {
        
        const course = await prisma.course.create({
          data: {
            profileId: profile.id,
            courseName: courseTemplate.name,
            courseDuration: courseTemplate.duration,
            courseDescription: `Comprehensive ${courseTemplate.name} preparation with regular tests and doubt solving sessions.`,
            courseAmount: courseTemplate.amount,
            courseMRP: courseTemplate.amount * 1.2,
            subjects: [courseTemplate.subject],
            examsPrepared: [courseTemplate.exam],
            classLevel: "Class 11 & 12",
            mode: "Offline",
            availableSeats: 50,
            batchSize: 60,
            startDate: new Date(),
          }
        });

        // Create Demo Sessions for the course
        const hasDemo = Math.random() > 0.3; // 70% chance of demo
        if (hasDemo) {
          await prisma.demoSession.create({
            data: {
              sessionId: `demo-${Math.random().toString(36).substr(2, 9)}`,
              profileId: profile.id,
              courseId: course.id,
              title: `Free Demo Class for ${courseTemplate.name}`,
              description: "Experience our teaching methodology firsthand.",
              availableDates: ["2024-02-01", "2024-02-02", "2024-02-05"],
              timeSlots: ["10:00-11:00", "16:00-17:00"],
              maxParticipants: 10,
              instructor: "Senior Faculty",
              subjects: [courseTemplate.subject],
              topics: ["Introduction", "Basic Concepts"],
              demoAddress: profile.address,
              classLevels: ["Class 11", "Class 12"]
            }
          });
        }
    }
  };

  console.log('Seeding Bhopal Coachings...');
  for (const c of bhopalCoachings) {
    await createCoaching(c, "Bhopal");
  }

  console.log('Seeding Indore Coachings...');
  for (const c of indoreCoachings) {
    await createCoaching(c, "Indore");
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
