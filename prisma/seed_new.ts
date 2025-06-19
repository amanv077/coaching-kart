import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

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

        console.log(`Created user: ${user.name} (${userData.role}) - ${user.email}`);
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
