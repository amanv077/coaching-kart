const fetch = require('node-fetch');

async function testPublicCoachingAPI() {
    try {
        console.log('Testing Public Coaching API...');
        
        // Test basic endpoint
        const response = await fetch('http://localhost:3000/api/coaching/public?page=1&limit=5');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('✅ API Response received');
        console.log('Total coachings:', data.pagination?.total || 0);
        console.log('Current page:', data.pagination?.page || 1);
        console.log('Total pages:', data.pagination?.totalPages || 0);
        console.log('Coachings returned:', data.coachings?.length || 0);
        
        if (data.coachings && data.coachings.length > 0) {
            const firstCoaching = data.coachings[0];
            console.log('\n📊 Sample coaching data:');
            console.log('- ID:', firstCoaching.id);
            console.log('- Organization:', firstCoaching.organizationName);
            console.log('- Profiles:', firstCoaching.profiles?.length || 0);
            
            if (firstCoaching.profiles && firstCoaching.profiles.length > 0) {
                const profile = firstCoaching.profiles[0];
                console.log('- Profile name:', profile.name);
                console.log('- Location:', `${profile.city}, ${profile.state}`);
                console.log('- Rating:', profile.rating || 'Not rated');
                console.log('- Contact:', profile.contactNumber ? '[PROTECTED]' : 'Not available');
                console.log('- Email:', profile.email ? '[PROTECTED]' : 'Not available');
                console.log('- Courses:', profile.courses?.length || 0);
            }
        }
        
        // Test with filters
        console.log('\n🔍 Testing with search filter...');
        const searchResponse = await fetch('http://localhost:3000/api/coaching/public?search=coaching&page=1&limit=3');
        const searchData = await searchResponse.json();
        console.log('Search results:', searchData.coachings?.length || 0);
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Error testing API:', error.message);
        console.log('\n💡 Make sure the development server is running with: npm run dev');
    }
}

// Run the test
testPublicCoachingAPI();
