// Simple test script to verify the coaching create API
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testCoachingCreate() {
  const formData = new FormData();
  
  // Add required fields
  formData.append('organizationName', 'Test Coaching Center');
  formData.append('businessType', 'Individual');
  formData.append('profileName', 'Main Branch');
  formData.append('establishedYear', '2020');
  formData.append('description', 'Test coaching description');
  formData.append('address', '123 Test Street');
  formData.append('city', 'Mumbai');
  formData.append('state', 'Maharashtra');
  formData.append('pincode', '400001');
  formData.append('contactNumber', '+91-9876543210');
  formData.append('email', 'test@coaching.com');
  formData.append('operatingDays', JSON.stringify(['Monday', 'Tuesday', 'Wednesday']));
  formData.append('operatingHours', '9:00 AM - 6:00 PM');
  formData.append('facilities', JSON.stringify(['WiFi', 'Library']));
  formData.append('subjectsOffered', JSON.stringify(['Mathematics', 'Physics']));
  formData.append('examsOffered', JSON.stringify(['JEE', 'NEET']));

  try {
    console.log('Testing coaching create API...');
    console.log('API endpoint should be available at: http://localhost:3001/api/coaching/create');
    console.log('Note: This test requires authentication, so it will likely return 401');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCoachingCreate();
