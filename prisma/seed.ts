import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const coachingData = [
  {
    name: "Aakash Institute",
    tagline: "Excellence in Medical & Engineering Coaching",
    city: "Delhi",
    state: "Delhi",
    exams: ["NEET", "JEE Main", "JEE Advanced"],
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    established: 1988,
  },
  {
    name: "FIITJEE",
    tagline: "For IIT-JEE with a difference",
    city: "New Delhi",
    state: "Delhi",
    exams: ["JEE Main", "JEE Advanced", "NTSE", "KVPY"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    established: 1992,
  },
  {
    name: "Allen Career Institute",
    tagline: "Where Excellence is a Habit",
    city: "Kota",
    state: "Rajasthan",
    exams: ["NEET", "JEE Main", "JEE Advanced", "AIIMS"],
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    established: 1988,
  },
  {
    name: "Resonance Eduventures",
    tagline: "Creating Success Stories",
    city: "Kota",
    state: "Rajasthan",
    exams: ["JEE Main", "JEE Advanced", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 2001,
  },
  {
    name: "Vibrant Academy",
    tagline: "Nurturing Excellence",
    city: "Kota",
    state: "Rajasthan",
    exams: ["JEE Main", "JEE Advanced"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    established: 2010,
  },
  {
    name: "Career Point",
    tagline: "Your Success Partner",
    city: "Kota",
    state: "Rajasthan",
    exams: ["JEE Main", "JEE Advanced", "NEET", "CA"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Commerce"],
    established: 1993,
  },
  {
    name: "Narayana Group",
    tagline: "Shaping Future Leaders",
    city: "Hyderabad",
    state: "Telangana",
    exams: ["NEET", "JEE Main", "JEE Advanced", "EAMCET"],
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    established: 1979,
  },
  {
    name: "Sri Chaitanya",
    tagline: "Quality Education at its Best",
    city: "Hyderabad",
    state: "Telangana",
    exams: ["NEET", "JEE Main", "JEE Advanced"],
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    established: 1986,
  },
  {
    name: "Vidyamandir Classes",
    tagline: "Where Dreams Come True",
    city: "Delhi",
    state: "Delhi",
    exams: ["JEE Main", "JEE Advanced", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 1988,
  },
  {
    name: "IMS Learning",
    tagline: "Your Gateway to Success",
    city: "Mumbai",
    state: "Maharashtra",
    exams: ["CAT", "GMAT", "GRE", "UPSC"],
    subjects: ["Quantitative Aptitude", "Verbal Ability", "Reasoning", "General Knowledge"],
    established: 1977,
  },
  {
    name: "TIME Institute",
    tagline: "Triumphant Institute of Management Education",
    city: "Hyderabad",
    state: "Telangana",
    exams: ["CAT", "GATE", "GRE", "Bank PO"],
    subjects: ["Quantitative Aptitude", "Verbal Ability", "Reasoning", "English"],
    established: 1992,
  },
  {
    name: "Bansal Classes",
    tagline: "The Pioneer of IIT-JEE Coaching",
    city: "Kota",
    state: "Rajasthan",
    exams: ["JEE Main", "JEE Advanced"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
    established: 1991,
  },
  {
    name: "Motion Education",
    tagline: "Moving Towards Excellence",
    city: "Kota",
    state: "Rajasthan",
    exams: ["JEE Main", "JEE Advanced", "NEET"],
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    established: 2007,
  },
  {
    name: "Chanakya Academy",
    tagline: "Success Through Strategy",
    city: "Patna",
    state: "Bihar",
    exams: ["UPSC", "BPSC", "SSC"],
    subjects: ["History", "Geography", "Polity", "Economics", "Current Affairs"],
    established: 2000,
  },
  {
    name: "Drishti IAS",
    tagline: "Your Vision, Our Mission",
    city: "Delhi",
    state: "Delhi",
    exams: ["UPSC", "State PSC"],
    subjects: ["History", "Geography", "Polity", "Economics", "Ethics", "Current Affairs"],
    established: 1999,
  },
];

const teacherNames = [
  "Dr. Rajesh Kumar", "Prof. Amit Sharma", "Dr. Priya Singh", "Mr. Suresh Patel",
  "Ms. Neha Gupta", "Dr. Vikram Rao", "Prof. Sunita Joshi", "Mr. Rahul Verma",
];

const facilities = [
  "Air Conditioned Classrooms", "Digital Smart Boards", "Library", "Computer Lab",
  "Cafeteria", "Parking", "CCTV Surveillance", "Drinking Water", "Medical Room"
];

async function main() {
  console.log("Starting seed...");

  // Hash password
  const hashedPassword = await bcrypt.hash("amanaman", 10);

  // Create coaching owner user
  const user = await prisma.user.upsert({
    where: { email: "amanverma12012001@gmail.com" },
    update: {},
    create: {
      name: "Aman Verma",
      email: "amanverma12012001@gmail.com",
      password: hashedPassword,
      phoneNumber: "+91 9876543210",
      city: "Delhi",
      otpVerified: true,
      profileCompleted: true,
      roles: {
        create: [{ role: "COACH" }]
      }
    }
  });

  console.log(`Created user: ${user.email}`);

  // Create 15 coaching institutes
  for (let i = 0; i < coachingData.length; i++) {
    const data = coachingData[i];
    const coachingId = `coaching-${i + 1}`;

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
            profileId: `profile-${i + 1}`,
            name: `${data.name} - ${data.city}`,
            branchName: "Main Branch",
            establishedYear: data.established,
            tagline: data.tagline,
            description: `${data.name} is a premier coaching institute offering top-quality education for ${data.exams.join(", ")} preparation. With experienced faculty and proven results, we help students achieve their academic goals.`,
            address: `123 Education Hub, ${data.city}`,
            landmark: "Near Metro Station",
            city: data.city,
            state: data.state,
            pincode: "110001",
            contactNumber: "+91 98765 43210",
            email: `info@${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
            website: `https://www.${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
            operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            operatingHours: "8:00 AM - 8:00 PM",
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
                  experience: 10 + Math.floor(Math.random() * 10),
                  bio: `Experienced educator with expertise in ${data.subjects.slice(0, 2).join(" and ")}.`
                },
                {
                  name: teacherNames[(i + 1) % teacherNames.length],
                  qualification: "M.Sc. in " + data.subjects[1],
                  specialization: data.subjects.slice(1, 3),
                  experience: 5 + Math.floor(Math.random() * 10),
                  bio: `Passionate teacher specializing in ${data.subjects.slice(1, 3).join(" and ")}.`
                }
              ]
            },
            courses: {
              create: [
                {
                  courseName: `${data.exams[0]} Complete Course`,
                  courseDuration: "12 Months",
                  courseDescription: `Comprehensive ${data.exams[0]} preparation course covering all topics with regular tests and doubt sessions.`,
                  courseAmount: 50000 + Math.floor(Math.random() * 50000),
                  courseMRP: 80000 + Math.floor(Math.random() * 40000),
                  courseDiscount: 15,
                  subjects: data.subjects,
                  examsPrepared: [data.exams[0]],
                  classLevel: "Class 12",
                  courseType: "Regular",
                  mode: "Offline",
                  batchSize: 30 + Math.floor(Math.random() * 20),
                  totalSeats: 50,
                  availableSeats: 20 + Math.floor(Math.random() * 20),
                  features: ["Daily Classes", "Weekly Tests", "Doubt Sessions", "Study Material", "Mock Tests"],
                  rating: 4.2 + Math.random() * 0.7,
                  totalRatings: 50 + Math.floor(Math.random() * 200),
                },
                {
                  courseName: `${data.exams[0]} Crash Course`,
                  courseDuration: "3 Months",
                  courseDescription: `Intensive ${data.exams[0]} crash course for quick revision and exam preparation.`,
                  courseAmount: 25000 + Math.floor(Math.random() * 15000),
                  courseMRP: 40000 + Math.floor(Math.random() * 10000),
                  courseDiscount: 20,
                  subjects: data.subjects.slice(0, 3),
                  examsPrepared: [data.exams[0]],
                  classLevel: "Class 12",
                  courseType: "Crash",
                  mode: "Offline",
                  batchSize: 40,
                  totalSeats: 60,
                  availableSeats: 30,
                  features: ["Intensive Classes", "Daily Tests", "Revision Notes", "Previous Year Papers"],
                  rating: 4.0 + Math.random() * 0.8,
                  totalRatings: 30 + Math.floor(Math.random() * 100),
                }
              ]
            }
          }
        }
      }
    });

    console.log(`Created coaching: ${coaching.organizationName}`);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
