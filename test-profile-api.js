// Test script for profile completion API
const testData = {
  bio: "I am a student looking to improve my mathematics and physics skills",
  interests: ["Mathematics", "Physics", "Chemistry"],
  learningGoals: ["Crack JEE", "Improve grades"],
  coachingMode: "Both",
  preferredSubjects: ["Mathematics", "Physics"],
  targetExams: ["JEE Main", "JEE Advanced"],
  studyLevel: "School",
  preferredCities: ["Delhi", "Mumbai"],
  budgetRange: "₹10,000 - ₹20,000",
  sessionTimings: ["Evening (6-10 PM)"],
  onlineClassFormat: "Live",
  devicePreference: "Desktop",
  internetSpeed: "High",
  maxTravelDistance: "10km",
  transportMode: "Bus",
  batchSize: "Small"
};

console.log("Test data for profile completion:");
console.log(JSON.stringify(testData, null, 2));
