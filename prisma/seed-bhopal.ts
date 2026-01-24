import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Bhopal coaching institutes data
const bhopalCoachings = [
  {
    name: "Mitesh Rathi Classes (MRC)",
    tagline: "Excellence in JEE Preparation",
    exams: ["JEE Main", "JEE Advanced"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    established: 2005,
  },
  {
    name: "Tripti Agrawal Classes (TAC)",
    tagline: "Your Path to Medical Excellence",
    exams: ["NEET", "AIIMS"],
    subjects: ["Physics", "Chemistry", "Biology"],
    established: 2008,
  },
  {
    name: "Toppers Academy Bhopal",
    tagline: "Where Toppers are Made",
    exams: ["JEE Main", "JEE Advanced", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 2010,
  },
  {
    name: "DS Classes Bhopal",
    tagline: "Foundation to Success",
    exams: ["JEE Main", "NEET", "Foundation"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 2012,
  },
  {
    name: "Aurous Academy",
    tagline: "Shine Bright Like Gold",
    exams: ["JEE Main", "JEE Advanced"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    established: 2015,
  },
  {
    name: "Illuminati Coaching Classes",
    tagline: "Illuminate Your Future",
    exams: ["JEE Main", "JEE Advanced", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 2011,
  },
  {
    name: "Step Up Academy Bhopal",
    tagline: "Step Up to Success",
    exams: ["NEET", "JEE Main"],
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    established: 2014,
  },
  {
    name: "Lakshya Institute Bhopal",
    tagline: "Aim High, Achieve Higher",
    exams: ["JEE Main", "JEE Advanced", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 2009,
  },
  {
    name: "Bodhi Tree Classes",
    tagline: "Nurturing Minds, Building Futures",
    exams: ["JEE Main", "NEET", "NTSE"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 2013,
  },
  {
    name: "Catalyst Academy Bhopal",
    tagline: "Catalyze Your Dreams",
    exams: ["JEE Main", "JEE Advanced"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    established: 2016,
  },
  {
    name: "Pinnacle Classes Bhopal",
    tagline: "Reach the Pinnacle of Success",
    exams: ["NEET", "AIIMS"],
    subjects: ["Physics", "Chemistry", "Biology"],
    established: 2010,
  },
  {
    name: "Excel Institute Bhopal",
    tagline: "Excel in Every Exam",
    exams: ["JEE Main", "NEET", "Board Exams"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 2007,
  },
];

const teacherNames = [
  "Dr. Ashok Mishra", "Prof. Santosh Dubey", "Dr. Kavita Sharma", "Mr. Rakesh Tiwari",
  "Ms. Sunita Jain", "Dr. Manoj Gupta", "Prof. Alok Verma", "Mr. Deepak Singh",
];

const facilities = [
  "Air Conditioned Classrooms", "Digital Smart Boards", "Library", "Computer Lab",
  "Cafeteria", "Parking", "CCTV Surveillance", "Drinking Water", "Medical Room"
];

async function main() {
  console.log("Adding Bhopal coaching institutes...");

  // Get the existing user
  const user = await prisma.user.findUnique({
    where: { email: "amanverma12012001@gmail.com" }
  });

  if (!user) {
    console.error("User not found! Please run the main seed first.");
    return;
  }

  // Create Bhopal coaching institutes
  for (let i = 0; i < bhopalCoachings.length; i++) {
    const data = bhopalCoachings[i];
    const coachingId = `coaching-bhopal-${i + 1}`;

    const coaching = await prisma.coaching.create({
      data: {
        coachingId,
        organizationName: data.name,
        ownerName: "Aman Verma",
        ownerEmail: "amanverma12012001@gmail.com",
        ownerPhone: "+91 9876543210",
        businessType: "Company",
        approved: true,
        isActive: true,
        ownerUserId: user.id,
        profiles: {
          create: {
            profileId: `profile-bhopal-${i + 1}`,
            name: data.name,
            branchName: "Main Branch",
            establishedYear: data.established,
            tagline: data.tagline,
            description: `${data.name} is a leading coaching institute in Bhopal offering quality education for ${data.exams.join(", ")} preparation. With dedicated faculty and proven track record, we help students achieve their dreams.`,
            address: `${100 + i * 10} MP Nagar, Zone 2, Bhopal`,
            landmark: "Near DB Mall",
            city: "Bhopal",
            state: "Madhya Pradesh",
            pincode: "462011",
            contactNumber: "+91 755 ${4000000 + i * 1000}",
            email: `info@${data.name.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '')}.com`,
            website: `https://www.${data.name.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '')}.com`,
            operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            operatingHours: "7:00 AM - 9:00 PM",
            facilities: facilities.slice(0, 5 + Math.floor(Math.random() * 4)),
            subjectsOffered: data.subjects,
            examsOffered: data.exams,
            approved: true,
            isActive: true,
            verificationStatus: "Verified",
            teachers: {
              create: [
                {
                  name: teacherNames[i % teacherNames.length],
                  qualification: "Ph.D. in " + data.subjects[0],
                  specialization: data.subjects.slice(0, 2),
                  experience: 8 + Math.floor(Math.random() * 12),
                  bio: `Senior faculty with expertise in ${data.subjects.slice(0, 2).join(" and ")}. Known for conceptual clarity and student-friendly approach.`
                },
                {
                  name: teacherNames[(i + 3) % teacherNames.length],
                  qualification: "M.Sc. in " + data.subjects[1],
                  specialization: data.subjects.slice(1, 3),
                  experience: 5 + Math.floor(Math.random() * 8),
                  bio: `Expert educator specializing in ${data.subjects.slice(1, 3).join(" and ")} with focus on problem-solving techniques.`
                }
              ]
            },
            courses: {
              create: [
                {
                  courseName: `${data.exams[0]} Complete Batch`,
                  courseDuration: "12 Months",
                  courseDescription: `Comprehensive ${data.exams[0]} preparation covering complete syllabus with daily tests, doubt sessions, and study material.`,
                  courseAmount: 35000 + Math.floor(Math.random() * 25000),
                  courseMRP: 60000 + Math.floor(Math.random() * 20000),
                  courseDiscount: 15,
                  subjects: data.subjects,
                  examsPrepared: [data.exams[0]],
                  classLevel: "Class 12",
                  courseType: "Regular",
                  mode: "Offline",
                  batchSize: 25 + Math.floor(Math.random() * 15),
                  totalSeats: 40,
                  availableSeats: 15 + Math.floor(Math.random() * 15),
                  features: ["Daily Classes", "Weekly Tests", "Doubt Sessions", "Study Material", "Mock Tests", "Performance Tracking"],
                  rating: 4.1 + Math.random() * 0.8,
                  totalRatings: 40 + Math.floor(Math.random() * 150),
                },
                {
                  courseName: `${data.exams[0]} Weekend Batch`,
                  courseDuration: "10 Months",
                  courseDescription: `Weekend intensive course for ${data.exams[0]} for school students who attend regular school.`,
                  courseAmount: 28000 + Math.floor(Math.random() * 12000),
                  courseMRP: 45000 + Math.floor(Math.random() * 10000),
                  courseDiscount: 10,
                  subjects: data.subjects.slice(0, 3),
                  examsPrepared: [data.exams[0]],
                  classLevel: "Class 11-12",
                  courseType: "Regular",
                  mode: "Offline",
                  batchSize: 35,
                  totalSeats: 50,
                  availableSeats: 25,
                  features: ["Weekend Classes", "Monthly Tests", "Study Material", "Online Doubt Support"],
                  rating: 4.0 + Math.random() * 0.7,
                  totalRatings: 25 + Math.floor(Math.random() * 80),
                }
              ]
            }
          }
        }
      }
    });

    console.log(`Created: ${coaching.organizationName}`);
  }

  console.log("\nBhopal coaching institutes added successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
