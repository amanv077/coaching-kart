"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, Users, Video, MapPin, Phone, Mail,
  XCircle, CheckCircle, AlertCircle, Star, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface DemoBooking {
  id: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  bookedAt: string;
  attended: boolean;
  feedback?: string;
  rating?: number;
  session: {
    id: string;
    title: string;
    description?: string;
    mode: 'online' | 'offline' | 'hybrid';
    dateTime: string;
    durationMinutes: number;
    location?: string;
    meetingLink?: string;
    instructor: string;
    topics: string[];
    status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
    course: {
      courseName: string;
    };
    profile: {
      name: string;
      city: string;
      state: string;
      contactNumber?: string;
      coaching: {
        organizationName: string;
      };
    };
  };
}

const UserDemoBookingsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    fetchMyBookings();
  }, [session]);

  const fetchMyBookings = async () => {
    try {
      const response = await fetch('/api/demo-bookings/my-bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancelling(bookingId);
    
    try {
      const response = await fetch(`/api/demo-bookings/booking/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel booking');

      toast.success('Booking cancelled successfully');
      fetchMyBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'no_show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Live': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isSessionUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date();
  };

  const isSessionToday = (dateTime: string) => {
    const sessionDate = new Date(dateTime);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  };

  const canCancelBooking = (booking: DemoBooking) => {
    return booking.status === 'confirmed' && 
           isSessionUpcoming(booking.session.dateTime) &&
           booking.session.status === 'Scheduled';
  };

  const upcomingBookings = bookings.filter(booking => 
    isSessionUpcoming(booking.session.dateTime) && 
    booking.status === 'confirmed' &&
    booking.session.status === 'Scheduled'
  );

  const pastBookings = bookings.filter(booking => 
    !isSessionUpcoming(booking.session.dateTime) || 
    booking.status === 'cancelled' ||
    booking.session.status === 'Completed' ||
    booking.session.status === 'Cancelled'
  );

  const todayBookings = upcomingBookings.filter(booking => 
    isSessionToday(booking.session.dateTime)
  );

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Demo Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your demo session bookings and view session details
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/book-demo">
              <Calendar className="h-4 w-4 mr-2" />
              Book New Demo
            </Link>
          </Button>
        </div>

        {/* Today's Sessions Alert */}
        {todayBookings.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <AlertCircle className="h-5 w-5" />
                Sessions Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                You have {todayBookings.length} demo session{todayBookings.length > 1 ? 's' : ''} scheduled for today!
              </p>
              <div className="space-y-3">
                {todayBookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{booking.session.title}</h4>
                        <p className="text-sm text-gray-600">
                          {booking.session.profile.coaching.organizationName} • {formatDateTime(booking.session.dateTime)}
                        </p>
                      </div>
                      {booking.session.meetingLink && (
                        <Button asChild size="sm">
                          <a href={booking.session.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-2" />
                            Join Now
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for organizing bookings */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Upcoming Sessions</h2>
              
              {upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                    <p className="text-gray-600 mb-4">Book a demo session to get started with your learning journey</p>
                    <Button asChild>
                      <Link href="/book-demo">Book Demo Session</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{booking.session.title}</CardTitle>
                            <CardDescription className="mt-1">
                              <span className="font-medium">{booking.session.profile.coaching.organizationName}</span>
                              {" • "}
                              <span>{booking.session.profile.name}</span>
                              {" • "}
                              <span>{booking.session.profile.city}, {booking.session.profile.state}</span>
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getBookingStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <Badge className={getSessionStatusColor(booking.session.status)}>
                              {booking.session.status}
                            </Badge>
                            {isSessionToday(booking.session.dateTime) && (
                              <Badge variant="destructive" className="text-xs">
                                Today
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Session Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-blue-600">
                              {formatDateTime(booking.session.dateTime)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{booking.session.durationMinutes} minutes</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {booking.session.mode === 'online' ? (
                              <Video className="h-4 w-4 text-gray-400" />
                            ) : (
                              <MapPin className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm capitalize">{booking.session.mode}</span>
                          </div>
                        </div>

                        {/* Course and Instructor */}
                        <div className="flex items-center gap-6">
                          <div className="text-sm">
                            <span className="text-gray-500">Course:</span>
                            <span className="ml-2 font-medium">{booking.session.course.courseName}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Instructor:</span>
                            <span className="ml-2 font-medium">{booking.session.instructor}</span>
                          </div>
                        </div>

                        {/* Topics */}
                        {booking.session.topics.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Topics to be covered:</h4>
                            <div className="flex flex-wrap gap-1">
                              {booking.session.topics.map((topic, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Location/Meeting Link */}
                        {booking.session.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{booking.session.location}</span>
                          </div>
                        )}
                        
                        {booking.session.meetingLink && (
                          <div className="flex items-center gap-2 text-sm">
                            <Video className="h-4 w-4 text-gray-400" />
                            <a 
                              href={booking.session.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              Join Meeting <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}

                        {/* Contact Info */}
                        {booking.session.profile.contactNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a 
                              href={`tel:${booking.session.profile.contactNumber}`}
                              className="text-blue-600 hover:underline"
                            >
                              {booking.session.profile.contactNumber}
                            </a>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 border-t flex gap-4">
                          {booking.session.meetingLink && isSessionToday(booking.session.dateTime) && (
                            <Button asChild className="bg-green-600 hover:bg-green-700">
                              <a href={booking.session.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-2" />
                                Join Session
                              </a>
                            </Button>
                          )}
                          
                          {canCancelBooking(booking) && (
                            <Button 
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancelling === booking.id}
                            >
                              {cancelling === booking.id ? (
                                'Cancelling...'
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Booking
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Past Bookings */}
          <TabsContent value="past">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Past Sessions</h2>
              
              {pastBookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No past sessions</h3>
                    <p className="text-gray-600">Your completed and cancelled sessions will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id} className="opacity-90">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{booking.session.title}</CardTitle>
                            <CardDescription className="mt-1">
                              <span className="font-medium">{booking.session.profile.coaching.organizationName}</span>
                              {" • "}
                              <span>{formatDateTime(booking.session.dateTime)}</span>
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getBookingStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            {booking.attended && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Attended
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-sm">
                            <span className="text-gray-500">Course:</span>
                            <span className="ml-2 font-medium">{booking.session.course.courseName}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Instructor:</span>
                            <span className="ml-2 font-medium">{booking.session.instructor}</span>
                          </div>
                        </div>

                        {/* Feedback and Rating */}
                        {booking.feedback && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Your Feedback:</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{booking.feedback}</p>
                          </div>
                        )}

                        {booking.rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Your Rating:</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < booking.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDemoBookingsPage;
