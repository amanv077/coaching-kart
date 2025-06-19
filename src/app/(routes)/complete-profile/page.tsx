'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

type CoachingMode = 'Online' | 'Offline' | 'Both' | '';
type StudyLevel = 'School' | 'College' | 'Competitive' | 'Professional' | '';
type BatchSizePreference = 'Individual' | 'Small' | 'Medium' | 'Large';

interface ProfileFormData {
  bio: string;
  interests: string[];
  learningGoals: string[];
  coachingMode: CoachingMode;
  preferredSubjects: string[];
  targetExams: string[];
  studyLevel: StudyLevel;
  preferredCities: string[];
  budgetRange: string;
  sessionTimings: string[];
  // Online specific
  onlineClassFormat?: string;
  devicePreference?: string;
  internetSpeed?: string;
  // Offline specific
  maxTravelDistance?: string;
  transportMode?: string;
  batchSize?: BatchSizePreference;
}

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi',
  'Computer Science', 'Economics', 'Accountancy', 'Business Studies',
  'History', 'Geography', 'Political Science', 'Psychology', 'Sociology'
];

const EXAMS = [
  'JEE Main', 'JEE Advanced', 'NEET', 'UPSC', 'SSC CGL', 'SSC CHSL',
  'IBPS PO', 'IBPS Clerk', 'SBI PO', 'RRB NTPC', 'GATE', 'CAT', 'MAT',
  'CLAT', 'AIIMS', 'JIPMER', 'BITSAT', 'VITEEE', 'COMEDK', 'KCET'
];

const CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad'
];

const TIMINGS = ['Morning (6-12 PM)', 'Afternoon (12-6 PM)', 'Evening (6-10 PM)', 'Late Evening (10-12 AM)'];

export default function CompleteProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);  const [formData, setFormData] = useState<ProfileFormData>({
    bio: '',
    interests: [],
    learningGoals: [],
    coachingMode: '' as CoachingMode,
    preferredSubjects: [],
    targetExams: [],
    studyLevel: '' as StudyLevel,
    preferredCities: [],
    budgetRange: '',
    sessionTimings: []
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile completed successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.bio.trim() !== '' && formData.interests.length > 0;
      case 2:
        return formData.coachingMode !== '';
      case 3:
        if (formData.coachingMode === 'Online' || formData.coachingMode === 'Both') {
          return formData.preferredSubjects.length > 0 && formData.studyLevel !== '';
        }
        return true;
      case 4:
        if (formData.coachingMode === 'Offline' || formData.coachingMode === 'Both') {
          return formData.preferredCities.length > 0;
        }
        return true;
      default:
        return true;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Basic Profile */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                    Tell us about yourself
                  </CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself, your goals, and what you're looking for..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label>Interests *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {SUBJECTS.map((subject) => (
                        <Badge
                          key={subject}
                          variant={formData.interests.includes(subject) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleArrayToggle('interests', subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="learningGoals">Learning Goals</Label>
                    <Textarea
                      id="learningGoals"
                      placeholder="What do you hope to achieve? (e.g., crack JEE, improve grades, learn new skills)"
                      value={formData.learningGoals.join(', ')}
                      onChange={(e) => handleInputChange('learningGoals', e.target.value.split(', ').filter(g => g.trim()))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Coaching Mode */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                    Preferred Coaching Mode
                  </CardTitle>
                </CardHeader>

                <RadioGroup
                  value={formData.coachingMode}
                  onValueChange={(value) => handleInputChange('coachingMode', value as CoachingMode)}
                  className="space-y-4"
                >
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <div>
                          <h3 className="font-semibold">Online Classes</h3>
                          <p className="text-sm text-gray-600">Learn from anywhere with live or recorded sessions</p>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Offline" id="offline" />
                      <Label htmlFor="offline" className="flex-1 cursor-pointer">
                        <div>
                          <h3 className="font-semibold">Offline Classes</h3>
                          <p className="text-sm text-gray-600">Traditional classroom experience with face-to-face interaction</p>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Both" id="both" />
                      <Label htmlFor="both" className="flex-1 cursor-pointer">
                        <div>
                          <h3 className="font-semibold">Both Online & Offline</h3>
                          <p className="text-sm text-gray-600">Flexible learning with both online and offline options</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Online Preferences */}
            {currentStep === 3 && (formData.coachingMode === 'Online' || formData.coachingMode === 'Both') && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                    Online Learning Preferences
                  </CardTitle>
                </CardHeader>

                <div className="space-y-6">
                  <div>
                    <Label>Preferred Subjects *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {SUBJECTS.map((subject) => (
                        <Badge
                          key={subject}
                          variant={formData.preferredSubjects.includes(subject) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleArrayToggle('preferredSubjects', subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Target Exams</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {EXAMS.map((exam) => (
                        <Badge
                          key={exam}
                          variant={formData.targetExams.includes(exam) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleArrayToggle('targetExams', exam)}
                        >
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Study Level *</Label>
                    <RadioGroup
                      value={formData.studyLevel}
                      onValueChange={(value) => handleInputChange('studyLevel', value as StudyLevel)}
                      className="flex flex-wrap gap-4 mt-2"
                    >
                      {['School', 'College', 'Competitive', 'Professional'].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} id={level} />
                          <Label htmlFor={level}>{level}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="onlineClassFormat">Class Format</Label>
                      <RadioGroup
                        value={formData.onlineClassFormat || ''}
                        onValueChange={(value) => handleInputChange('onlineClassFormat', value)}
                        className="mt-2"
                      >
                        {['Live', 'Recorded', 'Both'].map((format) => (
                          <div key={format} className="flex items-center space-x-2">
                            <RadioGroupItem value={format} id={format} />
                            <Label htmlFor={format}>{format}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="devicePreference">Device Preference</Label>
                      <RadioGroup
                        value={formData.devicePreference || ''}
                        onValueChange={(value) => handleInputChange('devicePreference', value)}
                        className="mt-2"
                      >
                        {['Mobile', 'Desktop', 'Tablet'].map((device) => (
                          <div key={device} className="flex items-center space-x-2">
                            <RadioGroupItem value={device} id={device} />
                            <Label htmlFor={device}>{device}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Offline Preferences */}
            {currentStep === 4 && (formData.coachingMode === 'Offline' || formData.coachingMode === 'Both') && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
                    Offline Learning Preferences
                  </CardTitle>
                </CardHeader>

                <div className="space-y-6">
                  <div>
                    <Label>Preferred Cities *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {CITIES.map((city) => (
                        <Badge
                          key={city}
                          variant={formData.preferredCities.includes(city) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleArrayToggle('preferredCities', city)}
                        >
                          {city}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxTravelDistance">Max Travel Distance</Label>
                      <RadioGroup
                        value={formData.maxTravelDistance || ''}
                        onValueChange={(value) => handleInputChange('maxTravelDistance', value)}
                        className="mt-2"
                      >
                        {['5km', '10km', '15km', '20km+'].map((distance) => (
                          <div key={distance} className="flex items-center space-x-2">
                            <RadioGroupItem value={distance} id={distance} />
                            <Label htmlFor={distance}>{distance}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="batchSize">Batch Size Preference</Label>
                      <RadioGroup
                        value={formData.batchSize || ''}
                        onValueChange={(value) => handleInputChange('batchSize', value as BatchSizePreference)}
                        className="mt-2"
                      >
                        {['Individual', 'Small (5-10)', 'Medium (10-20)', 'Large (20+)'].map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <RadioGroupItem value={size.split(' ')[0]} id={size} />
                            <Label htmlFor={size}>{size}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Final Preferences */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">5</span>
                    Final Preferences
                  </CardTitle>
                </CardHeader>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="budgetRange">Budget Range (Monthly)</Label>
                    <RadioGroup
                      value={formData.budgetRange}
                      onValueChange={(value) => handleInputChange('budgetRange', value)}
                      className="mt-2"
                    >
                      {['Under ₹5,000', '₹5,000 - ₹10,000', '₹10,000 - ₹20,000', '₹20,000 - ₹50,000', 'Above ₹50,000'].map((range) => (
                        <div key={range} className="flex items-center space-x-2">
                          <RadioGroupItem value={range} id={range} />
                          <Label htmlFor={range}>{range}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Preferred Session Timings</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TIMINGS.map((timing) => (
                        <Badge
                          key={timing}
                          variant={formData.sessionTimings.includes(timing) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleArrayToggle('sessionTimings', timing)}
                        >
                          {timing}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Great! You're almost done. Review your preferences and complete your profile to find the best coaching matches.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Complete Profile
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
