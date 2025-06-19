import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingUsers() {
  try {
    console.log('Starting to update existing users with otpVerified = true...');

    // Update all existing users to have otpVerified = true
    const result = await prisma.user.updateMany({
      data: {
        otpVerified: true,
      },
    });

    console.log(`Updated ${result.count} existing users with otpVerified = true`);
    
    // Display updated users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        otpVerified: true,
        createdAt: true,
      },
    });

    console.log('All users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - OTP Verified: ${user.otpVerified}`);
    });

  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingUsers();
