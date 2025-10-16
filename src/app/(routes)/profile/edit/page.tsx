'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageLoader } from '@/components/ui/loader';
import { useUserProfile } from '@/hooks/useUserProfile';
import { 
  User, 
  ArrowLeft, 
  Save, 
  BookOpen, 
  MapPin, 
  Monitor, 
  Users, 
  Settings,
  Globe,
  Target,
  DollarSign,
  Clock,
  Wifi,
  Car,
  Heart,
  GraduationCap,
  Info,
  CheckCircle,
  X,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface ProfileFormData {
  phoneNumber: string;
  bio: string;
  interests: string[];
  learningGoals: string[];
  coachingMode: 'Offline' | '';
  studyLevel: 'School' | 'College' | 'Competitive' | 'Professional' | '';
  preferredSubjects: string[];
  targetExams: string[];
  preferredCities: string[];
  maxTravelDistance: string;
  sessionTimings: string[];
  budgetRange: string;
  transportMode: string;
  batchSize: 'Individual' | 'Small' | 'Medium' | 'Large' | '';
  city: string;
  classLevel: string;
  age: string;
  schoolOrCollege: string;
  lookingFor: string;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { profile, loading: profileLoading, refetch } = useUserProfile();
  
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newExam, setNewExam] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newLearningGoal, setNewLearningGoal] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState<ProfileFormData>({
    phoneNumber: '',
    bio: '',
    interests: [],
    learningGoals: [],
    coachingMode: '',
    studyLevel: '',
    preferredSubjects: [],
    targetExams: [],
    preferredCities: [],
    maxTravelDistance: '',
    sessionTimings: [],
    budgetRange: '',
    transportMode: '',
    batchSize: '',
    city: '',
    classLevel: '',
    age: '',
    schoolOrCollege: '',
    lookingFor: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        phoneNumber: profile.phoneNumber || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
        learningGoals: profile.learningGoals || [],
        coachingMode: profile.coachingMode || '',
        studyLevel: profile.studyLevel || '',
        preferredSubjects: profile.preferredSubjects || [],
        targetExams: profile.targetExams || [],
        preferredCities: profile.preferredCities || [],
        maxTravelDistance: profile.maxTravelDistance || '',
        sessionTimings: profile.sessionTimings || [],
        budgetRange: profile.budgetRange || '',
        transportMode: profile.transportMode || '',
        batchSize: profile.batchSize || '',
        city: profile.city || '',
        classLevel: profile.classLevel || '',
        age: profile.age?.toString() || '',
        schoolOrCollege: profile.schoolOrCollege || '',
        lookingFor: profile.lookingFor || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: keyof ProfileFormData, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value.trim())) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentArray, value.trim()]
        }));
      }
      setValue('');
    }
  };

  const handleArrayRemove = (field: keyof ProfileFormData, value: string) => {
    const currentArray = formData[field] as string[];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      };

      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccessMessage('Profile updated successfully!');
      await refetch();
      
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || profileLoading) {
    return <PageLoader />;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Update your preferences and information</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Academic
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="logistics" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Logistics
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Enter your age"
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolOrCollege">School/College</Label>
                      <Input
                        id="schoolOrCollege"
                        value={formData.schoolOrCollege}
                        onChange={(e) => handleInputChange('schoolOrCollege', e.target.value)}
                        placeholder="Enter your institution"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lookingFor">What are you looking for?</Label>
                    <Textarea
                      id="lookingFor"
                      value={formData.lookingFor}
                      onChange={(e) => handleInputChange('lookingFor', e.target.value)}
                      placeholder="Describe what kind of coaching you're looking for..."
                      rows={3}
                    />
                  </div>

                  {/* Interests */}
                  <div>
                    <Label>Interests</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add an interest"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('interests', newInterest, setNewInterest))}
                      />
                      <Button
                        type="button"
                        onClick={() => handleArrayAdd('interests', newInterest, setNewInterest)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {interest}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('interests', interest)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Academic Tab */}
            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="studyLevel">Study Level</Label>
                      <Select value={formData.studyLevel} onValueChange={(value) => handleInputChange('studyLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select study level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="School">School</SelectItem>
                          <SelectItem value="College">College</SelectItem>
                          <SelectItem value="Competitive">Competitive</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="classLevel">Class Level</Label>
                      <Input
                        id="classLevel"
                        value={formData.classLevel}
                        onChange={(e) => handleInputChange('classLevel', e.target.value)}
                        placeholder="e.g., 10th, 12th, 1st Year"
                      />
                    </div>
                  </div>

                  {/* Learning Goals */}
                  <div>
                    <Label>Learning Goals</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newLearningGoal}
                        onChange={(e) => setNewLearningGoal(e.target.value)}
                        placeholder="Add a learning goal"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('learningGoals', newLearningGoal, setNewLearningGoal))}
                      />
                      <Button
                        type="button"
                        onClick={() => handleArrayAdd('learningGoals', newLearningGoal, setNewLearningGoal)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.learningGoals.map((goal, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {goal}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('learningGoals', goal)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Subjects */}
                  <div>
                    <Label>Preferred Subjects</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Add a subject"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('preferredSubjects', newSubject, setNewSubject))}
                      />
                      <Button
                        type="button"
                        onClick={() => handleArrayAdd('preferredSubjects', newSubject, setNewSubject)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.preferredSubjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {subject}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('preferredSubjects', subject)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Target Exams */}
                  <div>
                    <Label>Target Exams</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newExam}
                        onChange={(e) => setNewExam(e.target.value)}
                        placeholder="Add a target exam"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('targetExams', newExam, setNewExam))}
                      />
                      <Button
                        type="button"
                        onClick={() => handleArrayAdd('targetExams', newExam, setNewExam)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.targetExams.map((exam, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {exam}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('targetExams', exam)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Learning Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="coachingMode">Coaching Mode</Label>
                      <Select value={formData.coachingMode} onValueChange={(value) => handleInputChange('coachingMode', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coaching mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="batchSize">Batch Size Preference</Label>
                      <Select value={formData.batchSize} onValueChange={(value) => handleInputChange('batchSize', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual">Individual (1-on-1)</SelectItem>
                          <SelectItem value="Small">Small (2-5 students)</SelectItem>
                          <SelectItem value="Medium">Medium (6-15 students)</SelectItem>
                          <SelectItem value="Large">Large (15+ students)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="budgetRange">Budget Range</Label>
                      <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under ₹5,000">Under ₹5,000</SelectItem>
                          <SelectItem value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</SelectItem>
                          <SelectItem value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</SelectItem>
                          <SelectItem value="₹20,000 - ₹50,000">₹20,000 - ₹50,000</SelectItem>
                          <SelectItem value="Above ₹50,000">Above ₹50,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Logistics Tab */}
            <TabsContent value="logistics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Logistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preferred Cities */}
                  <div>
                    <Label>Preferred Cities</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Add a city"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('preferredCities', newCity, setNewCity))}
                      />
                      <Button
                        type="button"
                        onClick={() => handleArrayAdd('preferredCities', newCity, setNewCity)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.preferredCities.map((city, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {city}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('preferredCities', city)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="maxTravelDistance">Max Travel Distance</Label>
                      <Select value={formData.maxTravelDistance} onValueChange={(value) => handleInputChange('maxTravelDistance', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select distance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Within 5 km">Within 5 km</SelectItem>
                          <SelectItem value="Within 10 km">Within 10 km</SelectItem>
                          <SelectItem value="Within 20 km">Within 20 km</SelectItem>
                          <SelectItem value="Within 50 km">Within 50 km</SelectItem>
                          <SelectItem value="Any distance">Any distance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="transportMode">Transport Mode</Label>
                      <Select value={formData.transportMode} onValueChange={(value) => handleInputChange('transportMode', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public Transport">Public Transport</SelectItem>
                          <SelectItem value="Private Vehicle">Private Vehicle</SelectItem>
                          <SelectItem value="Walking">Walking</SelectItem>
                          <SelectItem value="Cycling">Cycling</SelectItem>
                          <SelectItem value="Any">Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Session Timings */}
                  <div>
                    <Label>Preferred Session Timings</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-9PM)', 'Night (9PM-12AM)'].map((timing) => (
                        <div key={timing} className="flex items-center space-x-2">
                          <Checkbox
                            id={timing}
                            checked={formData.sessionTimings.includes(timing)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  sessionTimings: [...prev.sessionTimings, timing]
                                }));
                              } else {
                                handleArrayRemove('sessionTimings', timing);
                              }
                            }}
                          />
                          <Label htmlFor={timing} className="text-sm">
                            {timing}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
