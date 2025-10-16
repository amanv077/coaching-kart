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
  ArrowLeft, Calendar, Clock, MapPin, BookOpen, CheckCircle, 
  Users, User, Phone, Mail
} from 'lucide-react';
import { toast } from 'sonner';

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
  isFree: boolean;
  price?: number;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
  course: {
    courseName: string;
  };
  profile: {
    name: string;
    city: string;
    state: string;
    contactNumber: string;
    coaching: {
      organizationName: string;
    };
  };
  bookings: Array<{
    id: string;
    status: string;
    selectedDate: string;
    selectedTime: string;
  }>;
}

interface BookingData {
  selectedDate: string;
  selectedTime: string;
  selectedSubject: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  specialRequest: string;
}

const DemoBookingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<DemoSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingData>({
    selectedDate: '',
    selectedTime: '',
    selectedSubject: '',
    studentName: '',
    studentPhone: '',
    studentEmail: '',
    specialRequest: '',
  });

  const coachingId = params?.id as string;

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    if (coachingId) {
      fetchDemoSessions();
    }
  }, [coachingId, session]);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        studentName: session.user.name || '',
        studentEmail: session.user.email || '',
      }));
    }
  }, [session]);

  const fetchDemoSessions = async () => {
    try {
      setLoading(true);
      // Fetch available demo sessions for this coaching profile
      const response = await fetch(`/api/demo-sessions/${coachingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch demo sessions');
      }

      const data = await response.json();
      setDemoSessions(data.demoSessions || []);
      
      if (data.demoSessions && data.demoSessions.length > 0) {
        setSelectedSession(data.demoSessions[0]);
      }
    } catch (error) {
      console.error('Error fetching demo sessions:', error);
      toast.error('Failed to load demo sessions');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimeSlots = (date: string) => {
    if (!selectedSession) return [];
    
    // Filter out booked time slots for the selected date
    const bookedSlots = selectedSession.bookings
      .filter(booking => 
        booking.selectedDate === date && 
        (booking.status === 'pending' || booking.status === 'confirmed')
      )
      .map(booking => booking.selectedTime);
    
    return selectedSession.timeSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSession || !formData.selectedDate || !formData.selectedTime || !formData.selectedSubject) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/offline-demo-bookings/${selectedSession.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Demo booking request submitted successfully!');
        router.push('/user-demo-bookings');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit booking request');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset time slot when date changes
    if (field === 'selectedDate') {
      setFormData(prev => ({ ...prev, selectedTime: '' }));
    }
  };

  if (loading) {
    return <PageLoader text="Loading demo sessions..." />;
  }

  if (demoSessions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Demo Sessions Available</h2>
            <p className="text-muted-foreground mb-4">
              This coaching center hasn't set up any demo sessions yet.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableTimeSlots = getAvailableTimeSlots(formData.selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Book a Demo Session</h1>
            {selectedSession && (
              <p className="text-muted-foreground mb-4">
                Schedule a demo session with <span className="font-semibold">{selectedSession.profile.coaching.organizationName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Selection */}
          {demoSessions.length > 1 && (
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Select Demo Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demoSessions.map((session) => (
                      <Card 
                        key={session.id} 
                        className={`cursor-pointer transition-all ${
                          selectedSession?.id === session.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{session.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {session.course.courseName}
                          </p>
                          {session.classLevels && session.classLevels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {session.classLevels.map((level, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {level}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Max {session.maxParticipants} students</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>{session.demoDays} day{session.demoDays > 1 ? 's' : ''}</span>
                          </div>
                          {session.isFree && (
                            <Badge variant="secondary" className="mt-2">Free</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Booking Details
                </CardTitle>
                <CardDescription>
                  Fill in your details to book the demo session
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSession && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <Label htmlFor="selectedDate">Select Date *</Label>
                      <Select value={formData.selectedDate} onValueChange={(value) => handleInputChange('selectedDate', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a date" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedSession.availableDates.map((date) => (
                            <SelectItem key={date} value={date}>
                              {new Date(date).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <Label htmlFor="selectedTime">Select Time Slot *</Label>
                      <Select 
                        value={formData.selectedTime} 
                        onValueChange={(value) => handleInputChange('selectedTime', value)}
                        disabled={!formData.selectedDate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.selectedDate && availableTimeSlots.length === 0 && (
                        <p className="text-sm text-red-500 mt-1">No time slots available for this date</p>
                      )}
                    </div>

                    {/* Subject Selection */}
                    <div>
                      <Label htmlFor="selectedSubject">Select Subject *</Label>
                      <Select value={formData.selectedSubject} onValueChange={(value) => handleInputChange('selectedSubject', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedSession.subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="studentName">Full Name *</Label>
                        <Input
                          id="studentName"
                          value={formData.studentName}
                          onChange={(e) => handleInputChange('studentName', e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentPhone">Phone Number *</Label>
                        <Input
                          id="studentPhone"
                          value={formData.studentPhone}
                          onChange={(e) => handleInputChange('studentPhone', e.target.value)}
                          placeholder="Your phone number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="studentEmail">Email Address *</Label>
                      <Input
                        id="studentEmail"
                        type="email"
                        value={formData.studentEmail}
                        onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                        placeholder="Your email address"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialRequest">Special Requirements (Optional)</Label>
                      <Textarea
                        id="specialRequest"
                        value={formData.specialRequest}
                        onChange={(e) => handleInputChange('specialRequest', e.target.value)}
                        placeholder="Any special requirements or questions..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting || !formData.selectedDate || !formData.selectedTime || !formData.selectedSubject}
                      className="w-full"
                    >
                      {submitting ? 'Submitting...' : 'Book Demo Session'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Session Info Sidebar */}
          <div className="lg:col-span-1">
            {selectedSession && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-blue-600">{selectedSession.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSession.course.courseName}</p>
                  </div>

                  {selectedSession.classLevels && selectedSession.classLevels.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Class Levels</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedSession.classLevels.map((level, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSession.description && (
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedSession.description}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Instructor: {selectedSession.instructor}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Duration: {selectedSession.demoDays} day{selectedSession.demoDays > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Max participants: {selectedSession.maxParticipants}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{selectedSession.demoAddress}</p>
                        {selectedSession.landmark && (
                          <p className="text-xs text-muted-foreground">Near: {selectedSession.landmark}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSession.profile.contactNumber}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Subjects Covered</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedSession.subjects.map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedSession.isFree && (
                    <div className="text-center">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Free Demo Session
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBookingPage;
