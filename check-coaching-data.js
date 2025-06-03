const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCoachingData() {
    try {
        console.log('🔍 Checking coaching data in database...');
        
        // Check total coachings
        const totalCoachings = await prisma.coaching.count();
        console.log(`📊 Total coachings in database: ${totalCoachings}`);
        
        // Check approved coachings
        const approvedCoachings = await prisma.coaching.count({
            where: { approved: true }
        });
        console.log(`✅ Approved coachings: ${approvedCoachings}`);
        
        // Check coachings with active profiles
        const coachingsWithActiveProfiles = await prisma.coaching.count({
            where: {
                approved: true,
                profiles: {
                    some: {
                        approved: true,
                        isActive: true
                    }
                }
            }
        });
        console.log(`🏃 Coachings with active profiles: ${coachingsWithActiveProfiles}`);
        
        if (coachingsWithActiveProfiles > 0) {
            // Get sample data
            const sampleCoaching = await prisma.coaching.findFirst({
                where: {
                    approved: true,
                    profiles: {
                        some: {
                            approved: true,
                            isActive: true
                        }
                    }
                },
                include: {
                    profiles: {
                        where: {
                            approved: true,
                            isActive: true
                        },
                        include: {
                            courses: {
                                select: {
                                    id: true,
                                    courseName: true,
                                    courseAmount: true
                                }
                            }
                        }
                    }
                }
            });
            
            if (sampleCoaching) {
                console.log('\n📝 Sample coaching data:');
                console.log(`- Organization: ${sampleCoaching.organizationName}`);
                console.log(`- Profiles: ${sampleCoaching.profiles.length}`);
                
                if (sampleCoaching.profiles.length > 0) {
                    const profile = sampleCoaching.profiles[0];
                    console.log(`- Profile name: ${profile.name}`);
                    console.log(`- Location: ${profile.city}, ${profile.state}`);
                    console.log(`- Contact: ${profile.contactNumber ? '[HIDDEN]' : 'Not set'}`);
                    console.log(`- Email: ${profile.email ? '[HIDDEN]' : 'Not set'}`);
                    console.log(`- Courses: ${profile.courses?.length || 0}`);
                }
            }
        } else {
            console.log('\n⚠️  No coachings with active profiles found.');
            console.log('💡 You may need to:');
            console.log('   1. Add coaching data to the database');
            console.log('   2. Set coaching.approved = true');
            console.log('   3. Set profile.approved = true and profile.isActive = true');
        }
        
        console.log('\n✅ Database check completed!');
        
    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the check
checkCoachingData();
