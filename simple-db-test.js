const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simpleTest() {
    try {
        console.log('Testing database connection...');
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Database connection successful:', result);
        
        const coachingCount = await prisma.coaching.count();
        console.log(`Total coachings: ${coachingCount}`);
        
        const profileCount = await prisma.coachingProfile.count();
        console.log(`Total profiles: ${profileCount}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

simpleTest();
