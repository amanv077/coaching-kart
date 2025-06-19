"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLoader } from '@/components/ui/loader';
import { 
  MapPin, Phone, Mail, Globe, Calendar, Users, BookOpen, Award, 
  Clock, Star, CheckCircle, Building2, Wifi, Monitor, Edit, ArrowLeft,
  Image as ImageIcon, User
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface CoachingData {
  id: string;
  coachingId: string;
  organizationName: string;
  ownerUserId: string;
  approved: boolean;
  isActive: boolean;
  profiles: Array<{
    id: string;
    profileId: string;
    name: string;
    branchName?: string;
    city: string;
    state: string;
    logo?: string;
    images: string[];
    tagline?: string;
    description: string;
    establishedYear: number;
    contactNumber: string;
    email: string;
    website?: string;
    address: string;
    pincode: string;
    operatingDays: string[];
    operatingHours: string;
    rating?: number;
    totalRatings?: number;
    verificationStatus: 'Pending' | 'Verified' | 'Rejected';
    subjectsOffered: string[];
    examsOffered: string[];
    facilities: string[];    courses: Array<{
      id: string;
      courseName: string;
      courseAmount: number;
    }>;
    teachers: Array<{
      id: string;
      name: string;
      qualification: string;
      experience: number;
      profileImage?: string;
      bio?: string;
      specialization?: string[];
      email?: string;
      phone?: string;
    }>;
  }>;
}

const CoachingDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [coaching, setCoaching] = useState<CoachingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coachingId = params?.id as string;

  useEffect(() => {
    if (coachingId) {
      fetchCoachingDetails();
    }
  }, [coachingId]);

  const fetchCoachingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coaching/${coachingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch coaching details');
      }

      const data = await response.json();
      setCoaching(data);
    } catch (error) {
      console.error('Error fetching coaching details:', error);
      setError('Failed to load coaching details');
      toast.error('Failed to load coaching details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading coaching details..." />;
  }

  if (error || !coaching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Coaching Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The coaching details you're looking for could not be found.
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
  const isOwner = session?.user?.id && coaching && session.user.id === coaching.ownerUserId;

  // Get the main profile data
  const mainProfile = coaching?.profiles?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-foreground mb-2">{coaching.organizationName}</h1>
              {mainProfile?.tagline && <p className="text-muted-foreground">{mainProfile.tagline}</p>}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={coaching.approved ? "default" : "secondary"}>
                  {coaching.approved ? "Approved" : "Pending Approval"}
                </Badge>
                {mainProfile && (
                  <Badge variant="outline">
                    {mainProfile.city}, {mainProfile.state}
                  </Badge>
                )}              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* If not logged in, show Login to Apply */}
              {!session?.user && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Login to Apply
                  </Link>
                </Button>
              )}
              
              {/* If logged in as user (student), show contact and demo buttons */}
              {session?.user && !isOwner && (
                <>
                  <Button asChild variant="outline">
                    <Link href={`tel:${mainProfile?.contactNumber}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Now
                    </Link>
                  </Button>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href={`/demo-booking/${coaching.coachingId}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book a Demo
                    </Link>
                  </Button>
                </>
              )}
              
              {/* If owner, show Edit Details */}
              {isOwner && (
                <Button asChild>
                  <Link href={`/coaching-dashboard/manage/${coaching.coachingId}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mainProfile?.description && (
                  <p className="text-gray-700 leading-relaxed">{mainProfile.description}</p>                )}
              
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mainProfile?.establishedYear && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-medium">Established</p>
                      <p className="text-lg font-bold text-blue-600">{mainProfile.establishedYear}</p>
                    </div>
                  )}
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">Subjects</p>
                    <p className="text-lg font-bold text-green-600">
                      {mainProfile?.subjectsOffered?.length || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">Exams</p>
                    <p className="text-lg font-bold text-purple-600">
                      {mainProfile?.examsOffered?.length || 0}
                    </p>
                  </div>
                </div>              </CardContent>
            </Card>

            {/* Coaching Images Gallery */}
            {mainProfile?.images && mainProfile.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    Coaching Gallery
                  </CardTitle>
                  <CardDescription>Take a virtual tour of our coaching facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mainProfile.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => window.open(image, '_blank')}
                      >
                        <img 
                          src={image} 
                          alt={`Coaching facility ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subjects & Exams */}
            {mainProfile && (mainProfile.subjectsOffered?.length > 0 || mainProfile.examsOffered?.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Subjects & Exams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mainProfile.subjectsOffered?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Subjects Offered</h4>
                      <div className="flex flex-wrap gap-2">
                        {mainProfile.subjectsOffered.map((subject, index) => (
                          <Badge key={index} variant="secondary">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {mainProfile.examsOffered?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Exam Preparation</h4>
                      <div className="flex flex-wrap gap-2">
                        {mainProfile.examsOffered.map((exam, index) => (
                          <Badge key={index} variant="outline">{exam}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}            {/* Courses */}
            {mainProfile?.courses && mainProfile.courses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Courses Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mainProfile.courses.map((course, index) => (
                      <div key={course.id} className="p-4 border rounded-lg">
                        <h5 className="font-semibold">{course.courseName}</h5>
                        <p className="text-lg font-bold text-green-600">₹{course.courseAmount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>            )}

            {/* Teachers */}
            {mainProfile?.teachers && mainProfile.teachers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Our Teachers
                  </CardTitle>
                  <CardDescription>Meet our experienced faculty members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mainProfile.teachers.map((teacher, index) => (
                      <div key={teacher.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            {teacher.profileImage ? (
                              <img 
                                src={teacher.profileImage} 
                                alt={teacher.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-white font-semibold text-lg">
                                {teacher.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-lg">{teacher.name}</h5>
                            <p className="text-sm text-gray-600 mb-1">{teacher.qualification}</p>
                            <p className="text-sm text-blue-600 font-medium">{teacher.experience} years experience</p>
                            {teacher.specialization && teacher.specialization.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {teacher.specialization.map((spec, specIndex) => (
                                  <Badge key={specIndex} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {teacher.bio && (
                          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{teacher.bio}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>            )}
          </div>          {/* Right Column - Actions & Contact */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="text-center text-blue-700">
                  {!session?.user && "Join Us Today"}
                  {session?.user && !isOwner && "Take Action"}
                  {isOwner && "Manage Your Coaching"}
                </CardTitle>
                <CardDescription className="text-center">
                  {!session?.user && "Login to apply and connect with us"}
                  {session?.user && !isOwner && "Get in touch or book a demo session"}
                  {isOwner && "Edit your coaching details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* If not logged in, show Login to Apply */}
                {!session?.user && (
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    <Link href="/login">
                      <User className="h-5 w-5 mr-2" />
                      Login to Apply
                    </Link>
                  </Button>
                )}
                
                {/* If logged in as user (student), show contact and demo buttons */}
                {session?.user && !isOwner && (
                  <>
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      <Link href={`/demo-booking/${coaching.coachingId}`}>
                        <Calendar className="h-5 w-5 mr-2" />
                        Book a Demo Now
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <Link href={`tel:${mainProfile?.contactNumber}`}>
                        <Phone className="h-5 w-5 mr-2" />
                        Contact Now
                      </Link>
                    </Button>
                  </>
                )}
                
                {/* If owner, show Edit Details */}
                {isOwner && (
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/coaching-dashboard/manage/${coaching.coachingId}`}>
                      <Edit className="h-5 w-5 mr-2" />
                      Edit Details
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>            {/* Contact Information - Only show if logged in */}
            {session?.user && mainProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{mainProfile.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{mainProfile.email}</span>
                  </div>
                  {mainProfile.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a 
                        href={mainProfile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}                </CardContent>
              </Card>
            )}

            {/* Contact Information prompt for non-logged in users */}
            {!session?.user && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Login to view contact details and connect with the coaching center directly.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/login">
                      <User className="h-4 w-4 mr-2" />
                      Login to View Contact Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {mainProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{mainProfile.address}</p>
                  <p className="text-gray-600">{mainProfile.city}, {mainProfile.state} - {mainProfile.pincode}</p>
                </CardContent>
              </Card>
            )}

            {/* Operating Hours */}
            {mainProfile && (mainProfile.operatingDays?.length > 0 || mainProfile.operatingHours) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mainProfile.operatingDays?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {mainProfile.operatingDays.map((day) => (
                        <Badge key={day} variant="outline" className="text-xs">{day}</Badge>
                      ))}
                    </div>
                  )}
                  {mainProfile.operatingHours && (
                    <p className="text-gray-600">{mainProfile.operatingHours}</p>
                  )}
                </CardContent>
              </Card>
            )}            {/* Facilities */}
            {mainProfile?.facilities && mainProfile.facilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    Facilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mainProfile.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}          
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingDetailPage;
