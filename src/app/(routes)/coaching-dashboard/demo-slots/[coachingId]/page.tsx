"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageLoader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Calendar, Clock, Plus, Users, Video, MapPin, 
  Trash2, Edit, CheckCircle, XCircle, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface DemoSession {
  id: string;
  sessionId: string;
  title: string;
  description?: string;
  mode: 'offline';
  classLevels: string[];
  availableDates: string[];
  timeSlots: string[];
  demoDays: number;
  maxParticipants: number;
  demoAddress: string;
  landmark?: string;
  instructor: string;
  subjects: string[];
  topics: string[];
  isFree: boolean;
  price?: number;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
  course: {
    courseName: string;
  };
  bookings: Array<{
    id: string;
    user: {
      name: string;
      email: string;
      phoneNumber?: string;
    };
    status: string;
    bookedAt: string;
  }>;
}

interface Course {
  id: string;
  courseName: string;
}

interface CoachingProfile {
  id: string;
  name: string;
  courses: Course[];
}

const DemoSlotManagementPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [profiles, setProfiles] = useState<CoachingProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const coachingId = params?.coachingId as string;

  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    classLevels: [''],
    availableDates: [''],
    timeSlots: [''],
    demoDays: 1,
    maxParticipants: 5,
    demoAddress: '',
    landmark: '',
    instructor: '',
    subjects: [''],
    topics: [] as string[],
    isFree: true,
    price: 0,
  });

  const [newTopic, setNewTopic] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [showAddCourse, setShowAddCourse] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    fetchCoachingProfiles();
  }, [session]);

  useEffect(() => {
    if (selectedProfile) {
      fetchDemoSessions();
    }
  }, [selectedProfile]);

  const fetchCoachingProfiles = async () => {
    try {
      const response = await fetch(`/api/coaching/${coachingId}`);
      if (!response.ok) throw new Error('Failed to fetch coaching details');
      
      const data = await response.json();
      setProfiles(data.profiles || []);
      
      if (data.profiles?.length > 0) {
        setSelectedProfile(data.profiles[0].id);
      }
    } catch (error) {
      console.error('Error fetching coaching profiles:', error);
      toast.error('Failed to load coaching profiles');
    } finally {
      setLoading(false);
    }
  };

  const fetchDemoSessions = async () => {
    if (!selectedProfile) return;
    
    try {
      const response = await fetch(`/api/demo-sessions/${selectedProfile}`);
      if (!response.ok) throw new Error('Failed to fetch demo sessions');
      
      const data = await response.json();
      setDemoSessions(data.demoSessions || []);
    } catch (error) {
      console.error('Error fetching demo sessions:', error);
      toast.error('Failed to load demo sessions');
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch(`/api/demo-sessions/${selectedProfile}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create demo session');
      }

      toast.success('Demo session created successfully!');
      setShowCreateForm(false);
      setFormData({
        courseId: '',
        title: '',
        description: '',
        classLevels: [''],
        availableDates: [''],
        timeSlots: [''],
        demoDays: 1,
        maxParticipants: 50,
        demoAddress: '',
        landmark: '',
        instructor: '',
        subjects: [''],
        topics: [],
        price: 0,
        isFree: true,
      });
      fetchDemoSessions();
    } catch (error) {
      console.error('Error creating demo session:', error);
      toast.error('Failed to create demo session');
    } finally {
      setCreating(false);
    }
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToRemove)
    }));
  };

  const addNewCourse = async () => {
    if (!newCourse.trim()) return;
    
    try {
      const response = await fetch(`/api/coaching/${coachingId}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName: newCourse.trim() }),
      });

      if (!response.ok) throw new Error('Failed to add course');
      
      const data = await response.json();
      
      // Update the profiles with the new course
      setProfiles(prev => prev.map(profile => 
        profile.id === selectedProfile 
          ? { ...profile, courses: [...profile.courses, data.course] }
          : profile
      ));
      
      // Select the new course
      setFormData(prev => ({ ...prev, courseId: data.course.id }));
      setNewCourse('');
      setShowAddCourse(false);
      toast.success('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
    }
  };

  const addField = (fieldName: 'classLevels' | 'availableDates' | 'timeSlots' | 'subjects') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeField = (fieldName: 'classLevels' | 'availableDates' | 'timeSlots' | 'subjects', index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const updateField = (fieldName: 'classLevels' | 'availableDates' | 'timeSlots' | 'subjects', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this demo session?')) return;

    try {
      const response = await fetch(`/api/demo-sessions/session/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete session');

      toast.success('Demo session deleted successfully');
      fetchDemoSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Live': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <PageLoader />;

  const currentProfile = profiles.find(p => p.id === selectedProfile);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href={`/coaching/${coachingId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Coaching Details
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Demo Slot Management</h1>
              <p className="text-gray-600 mt-2">Create and manage demo sessions for your coaching</p>
            </div>
            
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Demo Session
            </Button>
          </div>
        </div>

        {/* Profile Selector */}
        {profiles.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Coaching Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Create Demo Session Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Demo Session</CardTitle>
              <CardDescription>
                Set up a demo session for your students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSession} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="courseId">Course *</Label>
                    {!showAddCourse ? (
                      <div className="flex gap-2">
                        <Select 
                          value={formData.courseId} 
                          onValueChange={(value) => {
                            if (value === 'add-new') {
                              setShowAddCourse(true);
                            } else {
                              setFormData(prev => ({ ...prev, courseId: value }));
                            }
                          }}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select or add a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentProfile?.courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.courseName}
                              </SelectItem>
                            ))}
                            <SelectItem value="add-new">
                              <Plus className="h-4 w-4 mr-2 inline" />
                              Add New Course
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={newCourse}
                          onChange={(e) => setNewCourse(e.target.value)}
                          placeholder="Enter new course name"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewCourse())}
                        />
                        <Button type="button" onClick={addNewCourse} size="sm">
                          Add
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setShowAddCourse(false);
                            setNewCourse('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Session Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Session Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Introduction to Physics"
                      required
                    />
                  </div>

                  {/* Class Levels */}
                  <div className="space-y-2">
                    <Label>Class Levels *</Label>
                    {formData.classLevels.map((level, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Select 
                          value={level} 
                          onValueChange={(value) => updateField('classLevels', index, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10th">Class 10th</SelectItem>
                            <SelectItem value="11th">Class 11th</SelectItem>
                            <SelectItem value="12th">Class 12th</SelectItem>
                            <SelectItem value="Commerce">Commerce</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Arts">Arts</SelectItem>
                            <SelectItem value="NEET">NEET Preparation</SelectItem>
                            <SelectItem value="JEE">JEE Preparation</SelectItem>
                            <SelectItem value="IIT">IIT Preparation</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="MBA">MBA</SelectItem>
                            <SelectItem value="CA">CA (Chartered Accountancy)</SelectItem>
                            <SelectItem value="CS">CS (Company Secretary)</SelectItem>
                            <SelectItem value="CMA">CMA (Cost & Management Accountancy)</SelectItem>
                            <SelectItem value="BBA">BBA</SelectItem>
                            <SelectItem value="BCA">BCA</SelectItem>
                            <SelectItem value="BSc">BSc</SelectItem>
                            <SelectItem value="BCom">BCom</SelectItem>
                            <SelectItem value="BA">BA</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeField('classLevels', index)}
                          disabled={formData.classLevels.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addField('classLevels')}
                      className="mt-2"
                    >
                      Add Class Level
                    </Button>
                  </div>

                  {/* Available Dates */}
                  <div className="space-y-2">
                    <Label>Available Dates *</Label>
                    {formData.availableDates.map((date, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => updateField('availableDates', index, e.target.value)}
                          required
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeField('availableDates', index)}
                          disabled={formData.availableDates.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addField('availableDates')}
                      className="mt-2"
                    >
                      Add Date
                    </Button>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    <Label>Time Slots *</Label>
                    {formData.timeSlots.map((timeSlot, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          type="time"
                          value={timeSlot}
                          onChange={(e) => updateField('timeSlots', index, e.target.value)}
                          required
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeField('timeSlots', index)}
                          disabled={formData.timeSlots.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addField('timeSlots')}
                      className="mt-2"
                    >
                      Add Time Slot
                    </Button>
                  </div>

                  {/* Subjects */}
                  <div className="space-y-2">
                    <Label>Subjects *</Label>
                    {formData.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          value={subject}
                          onChange={(e) => updateField('subjects', index, e.target.value)}
                          placeholder="Enter subject"
                          required
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeField('subjects', index)}
                          disabled={formData.subjects.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addField('subjects')}
                      className="mt-2"
                    >
                      Add Subject
                    </Button>
                  </div>

                  {/* Max Participants */}
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    />
                  </div>

                  {/* Instructor */}
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor Name *</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                      placeholder="Teacher/Instructor name"
                      required
                    />
                  </div>

                  {/* Demo Address */}
                  <div className="space-y-2">
                    <Label htmlFor="demoAddress">Demo Address *</Label>
                    <Input
                      id="demoAddress"
                      value={formData.demoAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, demoAddress: e.target.value }))}
                      placeholder="Full address for demo session"
                      required
                    />
                  </div>

                  {/* Landmark */}
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      value={formData.landmark}
                      onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What will be covered in this demo session?"
                    rows={3}
                  />
                </div>

                {/* Topics */}
                <div className="space-y-2">
                  <Label>Topics to Cover</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="Add a topic"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                    />
                    <Button type="button" onClick={addTopic} variant="outline">
                      Add
                    </Button>
                  </div>
                  {formData.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {topic}
                          <XCircle 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeTopic(topic)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Demo Session'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Demo Sessions List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Demo Sessions</h2>
          
          {demoSessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No demo sessions yet</h3>
                <p className="text-gray-600 mb-4">Create your first demo session to start engaging with students</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Demo Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {demoSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{session.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {session.course.courseName} • {session.instructor}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Session Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {session.availableDates.length} available date{session.availableDates.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {session.timeSlots.length} time slot{session.timeSlots.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {session.bookings.length}/{session.maxParticipants} participants
                        </span>
                      </div>
                    </div>

                    {/* Class Levels */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-600">Class Levels:</h4>
                      <div className="flex flex-wrap gap-2">
                        {session.classLevels.map((level, index) => (
                          <Badge key={index} variant="secondary">{level}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-600">Subjects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {session.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline">{subject}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Available Dates */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-600">Available Dates:</h4>
                      <div className="flex flex-wrap gap-2">
                        {session.availableDates.map((date, index) => (
                          <span key={index} className="text-sm bg-blue-50 px-2 py-1 rounded">
                            {new Date(date).toLocaleDateString()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-600">Time Slots:</h4>
                      <div className="flex flex-wrap gap-2">
                        {session.timeSlots.map((timeSlot, index) => (
                          <span key={index} className="text-sm bg-green-50 px-2 py-1 rounded">
                            {timeSlot}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Demo Address */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-600">Demo Address:</h4>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{session.demoAddress}</span>
                        {session.landmark && (
                          <span className="text-sm text-gray-500">• {session.landmark}</span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {session.description && (
                      <p className="text-gray-600 text-sm">{session.description}</p>
                    )}

                    {/* Topics */}
                    {session.topics.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Topics to be covered:</h4>
                        <div className="flex flex-wrap gap-1">
                          {session.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bookings */}
                    {session.bookings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Recent Bookings:</h4>
                        <div className="space-y-2">
                          {session.bookings.slice(0, 3).map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium">{booking.user.name}</span>
                                <span className="text-gray-500 ml-2">{booking.user.email}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {booking.status}
                              </Badge>
                            </div>
                          ))}
                          {session.bookings.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{session.bookings.length - 3} more participants
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoSlotManagementPage;
