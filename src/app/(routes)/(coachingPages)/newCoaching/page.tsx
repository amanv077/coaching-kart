"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Upload, X, Building2, MapPin, Phone, Mail, Calendar, Users, BookOpen, Award, 
  Plus, Camera, User, Laptop, Monitor, Wifi, CheckCircle2, Star, Clock,
  GraduationCap, Target, Globe, ArrowLeft, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { ButtonLoader } from '@/components/ui/loader';

interface Teacher {
  id: string;
  name: string;
  qualification: string;
  experience: string;
  subjects: string[];
  description: string;
  image: File | null;
  imagePreview: string;
}

interface CoachingFormData {
  // Organization details
  organizationName: string;
  businessType: 'Individual' | 'Partnership' | 'Company' | 'Trust';
  gstNumber: string;
  panNumber: string;
  
  // Profile details
  profileName: string;
  branchName: string;
  establishedYear: number;
  tagline: string;
  description: string;
  
  // Mode of teaching
  mode: 'online' | 'offline' | 'both';
  
  // Location details (for offline/both)
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  
  // Contact details
  contactNumber: string;
  alternateNumber: string;
  email: string;
  website: string;
  
  // Social media
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  
  // Operating details
  operatingDays: string[];
  operatingHours: string;
  facilities: string[];
  
  // Academic details
  subjectsOffered: string[];
  customSubjects: string[];
  examsOffered: string[];
  customExams: string[];
  
  // Teachers
  teachers: Teacher[];
  
  // Images
  logo: File | null;
  images: File[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const COMMON_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science',
  'Economics', 'Accountancy', 'Business Studies', 'History', 'Geography', 'Political Science',
  'Sanskrit', 'French', 'German', 'Statistics', 'Philosophy', 'Psychology', 'Sociology',
  'Physical Education', 'Fine Arts', 'Music', 'Data Science', 'Web Development', 'Programming'
];

const COMMON_EXAMS = [
  'JEE Main', 'JEE Advanced', 'NEET', 'CBSE Board', 'ICSE Board', 'State Board',
  'CLAT', 'CAT', 'GATE', 'SSC', 'Banking Exams', 'UPSC', 'NDA', 'CDS', 'AFCAT',
  'IELTS', 'TOEFL', 'GRE', 'GMAT', 'SAT', 'BITSAT', 'VITEEE', 'COMEDK',
  'AIIMS', 'JIPMER', 'CA Foundation', 'CA Intermediate', 'CA Final', 'CS Executive'
];

const COMMON_FACILITIES = [
  'Library', 'Computer Lab', 'Science Lab', 'Sports Ground', 'Cafeteria', 'Parking',
  'WiFi', 'AC Classrooms', 'Smart Boards', 'Study Material', 'Test Series', 'Doubt Sessions',
  '24/7 Support', 'Online Portal', 'Mobile App', 'Recorded Lectures', 'Live Classes',
  'Mock Tests', 'Performance Analytics', 'Parent Portal', 'Scholarship Programs'
];

const NewCoaching = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Custom subject/exam inputs
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [customExamInput, setCustomExamInput] = useState('');

  const [formData, setFormData] = useState<CoachingFormData>({
    organizationName: '',
    businessType: 'Individual',
    gstNumber: '',
    panNumber: '',
    profileName: '',
    branchName: '',
    establishedYear: new Date().getFullYear(),
    tagline: '',
    description: '',
    mode: 'both',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    contactNumber: '',
    alternateNumber: '',
    email: '',
    website: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    operatingDays: [],
    operatingHours: '',
    facilities: [],
    subjectsOffered: [],
    customSubjects: [],
    examsOffered: [],
    customExams: [],
    teachers: [],
    logo: null,
    images: []
  });

  const handleInputChange = (field: keyof CoachingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'operatingDays' | 'facilities' | 'subjectsOffered' | 'examsOffered', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const addCustomSubject = () => {
    if (customSubjectInput.trim() && !formData.customSubjects.includes(customSubjectInput.trim())) {
      setFormData(prev => ({
        ...prev,
        customSubjects: [...prev.customSubjects, customSubjectInput.trim()]
      }));
      setCustomSubjectInput('');
    }
  };

  const addCustomExam = () => {
    if (customExamInput.trim() && !formData.customExams.includes(customExamInput.trim())) {
      setFormData(prev => ({
        ...prev,
        customExams: [...prev.customExams, customExamInput.trim()]
      }));
      setCustomExamInput('');
    }
  };

  const removeCustomSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      customSubjects: prev.customSubjects.filter(s => s !== subject)
    }));
  };

  const removeCustomExam = (exam: string) => {
    setFormData(prev => ({
      ...prev,
      customExams: prev.customExams.filter(e => e !== exam)
    }));
  };

  // Teacher management
  const addTeacher = () => {
    const newTeacher: Teacher = {
      id: `teacher_${Date.now()}`,
      name: '',
      qualification: '',
      experience: '',
      subjects: [],
      description: '',
      image: null,
      imagePreview: ''
    };
    setFormData(prev => ({
      ...prev,
      teachers: [...prev.teachers, newTeacher]
    }));
  };

  const updateTeacher = (teacherId: string, field: keyof Teacher, value: any) => {
    setFormData(prev => ({
      ...prev,
      teachers: prev.teachers.map(teacher =>
        teacher.id === teacherId ? { ...teacher, [field]: value } : teacher
      )
    }));
  };

  const removeTeacher = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      teachers: prev.teachers.filter(teacher => teacher.id !== teacherId)
    }));
  };

  const handleTeacherImageUpload = (teacherId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateTeacher(teacherId, 'image', file);
      const reader = new FileReader();
      reader.onload = () => updateTeacher(teacherId, 'imagePreview', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImagesPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error('Please login to create a coaching');
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'logo' && value) {
          submitData.append('logo', value);
        } else if (key === 'images' && Array.isArray(value)) {
          value.forEach((file, index) => {
            submitData.append(`image_${index}`, file);
          });
        } else if (key === 'teachers') {
          const teachers = value as Teacher[];
          teachers.forEach((teacher, index) => {
            if (teacher.image) {
              submitData.append(`teacher_image_${index}`, teacher.image);
            }
            submitData.append(`teacher_${index}`, JSON.stringify({
              ...teacher,
              image: null // Remove file object from JSON
            }));
          });
        } else if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== '') {
          submitData.append(key, value.toString());
        }
      });

      submitData.append('ownerUserId', session.user.id);

      const response = await fetch('/api/coaching/create', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Failed to create coaching');
      }

      const result = await response.json();
      toast.success('Coaching registration submitted successfully!');
      router.push('/coaching-dashboard');
    } catch (error) {
      console.error('Error creating coaching:', error);
      toast.error('Failed to create coaching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription>Tell us about your coaching organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="ABC Coaching Institute"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Trust">Trust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="profileName">Profile Name *</Label>
                  <Input
                    id="profileName"
                    value={formData.profileName}
                    onChange={(e) => handleInputChange('profileName', e.target.value)}
                    placeholder="Main Branch"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="establishedYear">Established Year *</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Excellence in Education"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your coaching, teaching methodology, success rate..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-600" />
                Teaching Mode & Contact
              </CardTitle>
              <CardDescription>How do you deliver your coaching services?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Teaching Mode */}
              <div>
                <Label>Teaching Mode *</Label>
                <RadioGroup
                  value={formData.mode}
                  onValueChange={(value) => handleInputChange('mode', value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                      <Globe className="h-4 w-4" />
                      Online Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="offline" id="offline" />
                    <Label htmlFor="offline" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="h-4 w-4" />
                      Offline Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="flex items-center gap-2 cursor-pointer">
                      <Laptop className="h-4 w-4" />
                      Online + Offline
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Location Details - Show only if not online-only */}
              {formData.mode !== 'online' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </h3>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Complete address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Delhi"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Delhi"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="110001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        placeholder="Near Metro Station"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@coaching.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternateNumber">Alternate Number</Label>
                    <Input
                      id="alternateNumber"
                      value={formData.alternateNumber}
                      onChange={(e) => handleInputChange('alternateNumber', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.coaching.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Subjects & Exams
              </CardTitle>
              <CardDescription>What subjects do you teach and which exams do you prepare students for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subjects Offered */}
              <div>
                <Label className="text-lg font-semibold">Subjects Offered</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
                  {COMMON_SUBJECTS.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subject-${subject}`}
                        checked={formData.subjectsOffered.includes(subject)}
                        onCheckedChange={() => handleArrayToggle('subjectsOffered', subject)}
                      />
                      <Label htmlFor={`subject-${subject}`} className="text-sm cursor-pointer">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {/* Custom subjects */}
                <div className="mt-4">
                  <Label>Add Custom Subject</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={customSubjectInput}
                      onChange={(e) => setCustomSubjectInput(e.target.value)}
                      placeholder="Enter subject name"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSubject()}
                    />
                    <Button type="button" onClick={addCustomSubject} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.customSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.customSubjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                          {subject}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeCustomSubject(subject)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Exams Offered */}
              <div>
                <Label className="text-lg font-semibold">Exams Preparation</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
                  {COMMON_EXAMS.map((exam) => (
                    <div key={exam} className="flex items-center space-x-2">
                      <Checkbox
                        id={`exam-${exam}`}
                        checked={formData.examsOffered.includes(exam)}
                        onCheckedChange={() => handleArrayToggle('examsOffered', exam)}
                      />
                      <Label htmlFor={`exam-${exam}`} className="text-sm cursor-pointer">
                        {exam}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {/* Custom exams */}
                <div className="mt-4">
                  <Label>Add Custom Exam</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={customExamInput}
                      onChange={(e) => setCustomExamInput(e.target.value)}
                      placeholder="Enter exam name"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomExam()}
                    />
                    <Button type="button" onClick={addCustomExam} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.customExams.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.customExams.map((exam) => (
                        <Badge key={exam} variant="secondary" className="flex items-center gap-1">
                          {exam}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeCustomExam(exam)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Star Teachers
              </CardTitle>
              <CardDescription>Add information about your experienced teachers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button type="button" onClick={addTeacher} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>

              {formData.teachers.map((teacher, index) => (
                <Card key={teacher.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Teacher {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTeacher(teacher.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Teacher Image */}
                    <div>
                      <Label>Teacher Photo</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          {teacher.imagePreview ? (
                            <img src={teacher.imagePreview} alt="Teacher" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Camera className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleTeacherImageUpload(teacher.id, e)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Teacher Name *</Label>
                        <Input
                          value={teacher.name}
                          onChange={(e) => updateTeacher(teacher.id, 'name', e.target.value)}
                          placeholder="Dr. John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label>Qualification *</Label>
                        <Input
                          value={teacher.qualification}
                          onChange={(e) => updateTeacher(teacher.id, 'qualification', e.target.value)}
                          placeholder="M.Tech, Ph.D"
                          required
                        />
                      </div>
                      <div>
                        <Label>Experience *</Label>
                        <Input
                          value={teacher.experience}
                          onChange={(e) => updateTeacher(teacher.id, 'experience', e.target.value)}
                          placeholder="10+ years"
                          required
                        />
                      </div>
                      <div>
                        <Label>Subjects Teaching</Label>
                        <Input
                          value={teacher.subjects.join(', ')}
                          onChange={(e) => updateTeacher(teacher.id, 'subjects', e.target.value.split(', ').filter(s => s.trim()))}
                          placeholder="Mathematics, Physics"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Teacher Description</Label>
                      <Textarea
                        value={teacher.description}
                        onChange={(e) => updateTeacher(teacher.id, 'description', e.target.value)}
                        placeholder="Brief description about the teacher's expertise and achievements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                Images & Media
              </CardTitle>
              <CardDescription>Upload your coaching logo and facility images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label className="text-lg font-semibold">Coaching Logo</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-500">Upload your coaching logo (recommended: square format)</p>
                  </div>
                </div>
              </div>

              {/* Images Upload */}
              <div>
                <Label className="text-lg font-semibold">Coaching Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                  className="mt-2 mb-4"
                />
                <p className="text-sm text-gray-500 mb-4">Upload multiple images of your coaching facilities, classrooms, labs, etc.</p>
                
                {imagesPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                Facilities & Operations
              </CardTitle>
              <CardDescription>What facilities do you offer and what are your operating hours?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Operating Days */}
              <div>
                <Label className="text-lg font-semibold">Operating Days</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={formData.operatingDays.includes(day)}
                        onCheckedChange={() => handleArrayToggle('operatingDays', day)}
                      />
                      <Label htmlFor={`day-${day}`} className="cursor-pointer">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input
                  id="operatingHours"
                  value={formData.operatingHours}
                  onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                  placeholder="9:00 AM - 9:00 PM"
                />
              </div>

              {/* Facilities */}
              <div>
                <Label className="text-lg font-semibold">Facilities Available</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {COMMON_FACILITIES.map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Checkbox
                        id={`facility-${facility}`}
                        checked={formData.facilities.includes(facility)}
                        onCheckedChange={() => handleArrayToggle('facilities', facility)}
                      />
                      <Label htmlFor={`facility-${facility}`} className="text-sm cursor-pointer">
                        {facility}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Register Your Coaching</h1>
          <p className="text-gray-600">Create a comprehensive profile to attract students</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <ButtonLoader />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Register Coaching
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCoaching;