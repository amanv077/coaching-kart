"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageLoader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, Users, Video, MapPin, Search, 
  Filter, BookOpen, User, CheckCircle, Star
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface DemoSession {
  id: string;
  sessionId: string;
  title: string;
  description?: string;
  mode: 'online' | 'offline' | 'hybrid';
  dateTime: string;
  durationMinutes: number;
  maxParticipants: number;
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
    coaching: {
      organizationName: string;
    };
  };
  bookings: Array<{
    id: string;
    status: string;
  }>;
}

const UserDemoBookingPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    fetchAvailableDemoSessions();
  }, [session]);

  useEffect(() => {
    filterSessions();
  }, [demoSessions, searchTerm, modeFilter, cityFilter, courseFilter]);

  const fetchAvailableDemoSessions = async () => {
    try {
      // This would need to be implemented as a general API to fetch all available demo sessions
      const response = await fetch('/api/demo-sessions/available');
      if (!response.ok) throw new Error('Failed to fetch demo sessions');
      
      const data = await response.json();
      setDemoSessions(data.demoSessions || []);
    } catch (error) {
      console.error('Error fetching demo sessions:', error);
      toast.error('Failed to load demo sessions');
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = demoSessions.filter(session => {
      // Only show scheduled sessions in the future
      const sessionDate = new Date(session.dateTime);
      const now = new Date();
      return session.status === 'Scheduled' && sessionDate > now;
    });

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.profile.coaching.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply mode filter
    if (modeFilter !== 'all') {
      filtered = filtered.filter(session => session.mode === modeFilter);
    }

    // Apply city filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter(session => session.profile.city === cityFilter);
    }

    // Apply course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(session => session.course.courseName === courseFilter);
    }

    setFilteredSessions(filtered);
  };

  const handleBookDemo = async (sessionId: string) => {
    setBooking(sessionId);
    
    try {
      const response = await fetch(`/api/demo-bookings/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to book demo');
      }

      const data = await response.json();
      toast.success('Demo session booked successfully! Check your email for details.');
      
      // Refresh the sessions list
      fetchAvailableDemoSessions();
    } catch (error: any) {
      console.error('Error booking demo:', error);
      toast.error(error.message || 'Failed to book demo session');
    } finally {
      setBooking(null);
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

  const getAvailableSpots = (session: DemoSession) => {
    const booked = session.bookings.filter(b => b.status === 'confirmed').length;
    return session.maxParticipants - booked;
  };

  // Get unique values for filters
  const uniqueCities = [...new Set(demoSessions.map(s => s.profile.city))];
  const uniqueCourses = [...new Set(demoSessions.map(s => s.course.courseName))];

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Demo Sessions</h1>
          <p className="text-gray-600 mt-2">
            Explore and book free demo sessions from top coaching institutes
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/user-demo-bookings">
              <Calendar className="h-4 w-4 mr-2" />
              My Bookings
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search sessions, courses, coaching..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Mode Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mode</label>
                <Select value={modeFilter} onValueChange={setModeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {uniqueCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {uniqueCourses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Sessions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Available Demo Sessions ({filteredSessions.length})
            </h2>
          </div>
          
          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No demo sessions available</h3>
                <p className="text-gray-600">
                  {demoSessions.length === 0 
                    ? "There are no demo sessions scheduled at the moment."
                    : "Try adjusting your filters to see more results."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredSessions.map((session) => {
                const availableSpots = getAvailableSpots(session);
                const isFull = availableSpots <= 0;
                
                return (
                  <Card key={session.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{session.title}</CardTitle>
                          <CardDescription className="mt-1">
                            <span className="font-medium">{session.profile.coaching.organizationName}</span>
                            {" • "}
                            <span>{session.profile.name}</span>
                            {" • "}
                            <span>{session.profile.city}, {session.profile.state}</span>
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge 
                            variant={session.mode === 'online' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {session.mode}
                          </Badge>
                          {availableSpots <= 5 && !isFull && (
                            <Badge variant="destructive" className="text-xs">
                              Only {availableSpots} spots left
                            </Badge>
                          )}
                          {isFull && (
                            <Badge variant="destructive" className="text-xs">
                              Fully Booked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Course and Instructor */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{session.course.courseName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{session.instructor}</span>
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-blue-600">
                            {formatDateTime(session.dateTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{session.durationMinutes} minutes</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {availableSpots} spots available
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {session.mode === 'online' ? (
                            <Video className="h-4 w-4 text-gray-400" />
                          ) : (
                            <MapPin className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">
                            {session.mode === 'online' ? 'Online Session' : session.location}
                          </span>
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

                      {/* Action Button */}
                      <div className="pt-4 border-t">
                        <Button 
                          onClick={() => handleBookDemo(session.id)}
                          disabled={isFull || booking === session.id}
                          className={isFull ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
                          size="lg"
                        >
                          {booking === session.id ? (
                            'Booking...'
                          ) : isFull ? (
                            'Fully Booked'
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Book Free Demo
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDemoBookingPage;
