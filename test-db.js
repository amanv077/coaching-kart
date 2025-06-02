require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKV1IxRTc0QzdGQzJNUEs3U0gzR1RBV1giLCJ0ZW5hbnRfaWQiOiIxYzYwZTA2NWFmY2Y4NWM4MTBlZmI1NjcyMTU1YTE3MTg0YWFlOTc3OTQzMWJmNTc2M2IzNTk0MTVlZWI1ODJkIiwiaW50ZXJuYWxfc2VjcmV0IjoiNzZhN2Y1NDEtYzlhYS00Y2QwLWFiZTYtNjFiZmQ4YWU1NDUwIn0.iBDV7yxbrxIndz8AkBenfsiFj3iyAmjU4sfU-5H4qI8",
      }
    }
  });
  
  try {
    console.log('Testing database connection...');
    
    // Try to connect to the database
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try to query the database
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful:', result);
    
    // Test schema access
    console.log('Testing schema access...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    
    if (error.code === 'P1003') {
      console.error('Database schema does not exist or is inaccessible');
    } else if (error.code === 'P1001') {
      console.error('Cannot reach database server');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
