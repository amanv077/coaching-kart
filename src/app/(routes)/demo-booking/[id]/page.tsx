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
import { 
  ArrowLeft, Calendar, Clock, User, Phone, Mail, BookOpen, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface DemoBookingData {
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  preferredDate: string;
  preferredTime: string;
  subject: string;
  message: string;
}

const DemoBookingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [coaching, setCoaching] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<DemoBookingData>({
    studentName: '',
    studentPhone: '',
    studentEmail: '',
    preferredDate: '',
    preferredTime: '',
    subject: '',
    message: ''
  });

  const coachingId = params?.id as string;

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    if (coachingId) {
      fetchCoachingDetails();
    }
  }, [coachingId, session]);

  const fetchCoachingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coaching/${coachingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch coaching details');
      }

      const data = await response.json();
      setCoaching(data);
      
      // Pre-fill user data
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          studentName: session.user.name || '',
          studentEmail: session.user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching coaching details:', error);
      toast.error('Failed to load coaching details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Here you would typically send the demo booking request to an API
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Demo booking request submitted successfully!');
      router.push(`/coaching/${coachingId}`);
    } catch (error) {
      console.error('Error submitting demo booking:', error);
      toast.error('Failed to submit demo booking request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof DemoBookingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <PageLoader text="Loading booking form..." />;
  }

  if (!coaching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Coaching Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The coaching you're trying to book a demo for could not be found.
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

  const mainProfile = coaching?.profiles?.[0];

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
            <p className="text-muted-foreground mb-4">
              Schedule a free demo session with <span className="font-semibold">{coaching.organizationName}</span>
            </p>
            {mainProfile && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600">{mainProfile.city}, {mainProfile.state}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Demo Booking Details
                </CardTitle>
                <CardDescription>
                  Fill in your details to book a free demo session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="+91 9876543210"
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
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredDate">Preferred Date *</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredTime">Preferred Time *</Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                          <SelectItem value="18:00">6:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject of Interest</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainProfile?.subjectsOffered?.map((subject: string) => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Additional Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Any specific requirements or questions..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Book Demo Session
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Coaching Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{coaching.organizationName}</CardTitle>
                {mainProfile?.tagline && (
                  <CardDescription>{mainProfile.tagline}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {mainProfile && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{mainProfile.contactNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{mainProfile.email}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Subjects Available
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {mainProfile.subjectsOffered?.slice(0, 5).map((subject: string, index: number) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {subject}
                          </span>
                        ))}
                        {mainProfile.subjectsOffered?.length > 5 && (
                          <span className="text-xs text-gray-500">+{mainProfile.subjectsOffered.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Free Demo Session</span>
                </div>
                <p className="text-sm text-green-600">
                  This is a completely free demo session. No payment required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBookingPage;
