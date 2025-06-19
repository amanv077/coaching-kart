// Simple test for the API endpoints
async function testProfileAPI() {
  try {
    // Test GET endpoint
    const response = await fetch('http://localhost:3000/api/user/complete-profile');
    console.log('GET /api/user/complete-profile status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Profile data:', data);
    } else {
      console.log('Error response:', await response.text());
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run test (this would be for manual testing in browser console)
// testProfileAPI();
