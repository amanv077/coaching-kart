// Simple script to check database state
const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  console.log('Initializing Prisma client...');
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Simple connection test
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          email: true,
          name: true,
        }
      });
      
      console.log('\n👥 Recent users:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`);
      });
    }
    
    // Check accounts
    const accountCount = await prisma.account.count();
    console.log(`🔑 Total accounts: ${accountCount}`);
    
    // Check sessions
    const sessionCount = await prisma.session.count();
    console.log(`🎫 Active sessions: ${sessionCount}`);
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
}

checkDatabase();
