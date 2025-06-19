import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // First, check if OTP columns exist and add them if they don't
  try {
    await prisma.$executeRaw`SELECT "otpVerified" FROM "users" LIMIT 1`;
    console.log('OTP columns exist');
  } catch (columnError) {
    console.log('OTP columns do not exist, adding them...');
    try {
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otpVerified" BOOLEAN DEFAULT false`;
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otp" TEXT`;
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3)`;
      console.log('OTP columns added successfully');
    } catch (alterError) {
      console.error('Error adding OTP columns:', alterError);
      console.log('Proceeding without OTP columns...');
    }
  }

  // Create demo users with different roles
  const users = [
    {
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'amanaman',
      role: 'ADMIN',
      phoneNumber: '+91-9876543210',
      city: 'Delhi',
      age: 30,
      schoolOrCollege: 'IIT Delhi',
      lookingFor: 'Both',
    },
    {
      name: 'Coaching Center',
      email: 'coaching@gmail.com', 
      password: 'amanaman',
      role: 'COACH',
      phoneNumber: '+91-9876543211',
      city: 'Mumbai',
      age: 35,
      schoolOrCollege: 'IIT Mumbai',
      lookingFor: 'Both',
    },
    {
      name: 'Student User',
      email: 'user@gmail.com',
      password: 'amanaman', 
      role: 'STUDENT',
      phoneNumber: '+91-9876543212',
      city: 'Bangalore',
      classLevel: '12th Grade',
      age: 18,
      schoolOrCollege: 'Delhi Public School',
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
      });      if (!existingUser) {
        // Try to create user with OTP fields, fallback without them if schema doesn't support it
        try {
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
              profileCompleted: true,
              otpVerified: true, // Admin and demo users are pre-verified
              otp: null,
              otpExpiry: null,
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
        } catch (createError) {
          console.log(`Failed to create user with OTP fields, trying without: ${userData.email}`);
          // Fallback: Create user without OTP fields
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
              profileCompleted: true,
            },
          });

          // Create user role
          await tx.userRole.create({
            data: {
              userId: user.id,
              role: userData.role as any,
            }
          });

          console.log(`Created user (without OTP): ${user.name} (${userData.role}) - ${user.email}`);
        }
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
