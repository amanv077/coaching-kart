"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import { ProfileCompletionPrompt } from '@/components/common/ProfileCompletionPrompt';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Award, TrendingUp, Calendar, Users, Target, Star } from 'lucide-react';
import Link from 'next/link';

const StudentDashboard = () => {
  const { data: session, status } = useSession();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showProfilePrompt, setShowProfilePrompt] = useState(true);

  if (status === 'loading' || profileLoading) {
    return <PageLoader text="Loading your dashboard..." />;
  }
  if (!session) {
    redirect('/login');
  }

  // Check if user has STUDENT role (users can have multiple roles)
  const userRoles = session.user?.roles || [session.user?.role];
  const hasStudentRole = userRoles.includes('STUDENT');
  
  if (!hasStudentRole) {
    // Redirect to appropriate dashboard based on primary role
    const primaryRole = session.user?.role;
    if (primaryRole === 'COACH') {
      redirect('/coaching-dashboard');
    } else if (primaryRole === 'ADMIN') {
      redirect('/admin-dashboard');
    } else {
      redirect('/');
    }
  }

  const shouldShowProfilePrompt = !profile?.profileCompleted && showProfilePrompt;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {session.user?.name}! 🎓
            </h1>
            <p className="text-muted-foreground">
              {profile?.profileCompleted 
                ? "Ready to continue your personalized learning journey?"
                : "Complete your profile to unlock personalized features!"
              }
            </p>
          </div>
          {profile?.profileCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Profile Complete
            </Badge>
          )}
        </div>

        {/* Profile Completion Prompt */}
        {shouldShowProfilePrompt && (
          <ProfileCompletionPrompt 
            onDismiss={() => setShowProfilePrompt(false)}
          />
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-blue-900">5</p>
                  <p className="text-xs text-blue-600">2 in progress</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Study Hours</p>
                  <p className="text-2xl font-bold text-green-900">24</p>
                  <p className="text-xs text-green-600">This week</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Achievements</p>
                  <p className="text-2xl font-bold text-purple-900">12</p>
                  <p className="text-xs text-purple-600">Certificates earned</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Progress Score</p>
                  <p className="text-2xl font-bold text-orange-900">85%</p>
                  <p className="text-xs text-orange-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% this month
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Recommendations */}
        {profile?.profileCompleted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h4 className="font-semibold text-gray-900 mb-2">Based on your preferences</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {profile.coachingMode === 'Online' && "Online courses in "}
                    {profile.coachingMode === 'Offline' && "Local coaching centers for "}
                    {profile.coachingMode === 'Both' && "Flexible learning options for "}
                    {profile.preferredSubjects.slice(0, 2).join(', ')}
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    View Matches
                  </Button>
                </div>
                <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <h4 className="font-semibold text-gray-900 mb-2">Upcoming Demo Sessions</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Free demo sessions available for {profile.targetExams.slice(0, 2).join(', ')} preparation
                  </p>
                  <Button size="sm" variant="outline" className="border-green-600 text-green-700">
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Courses
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href="/courses">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  id: 1, 
                  name: "Advanced Mathematics", 
                  progress: 65, 
                  nextClass: "Tomorrow 10:00 AM",
                  instructor: "Dr. Sharma"
                },
                { 
                  id: 2, 
                  name: "Physics Fundamentals", 
                  progress: 80, 
                  nextClass: "Today 3:00 PM",
                  instructor: "Prof. Kumar"
                },
                { 
                  id: 3, 
                  name: "Chemistry Mastery", 
                  progress: 45, 
                  nextClass: "Friday 11:00 AM",
                  instructor: "Dr. Patel"
                }
              ].map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
                        <p className="text-sm text-gray-600">by {course.instructor}</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Next: {course.nextClass}</span>
                      </div>

                      <Button className="w-full">
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-20 flex flex-col space-y-2 hover:bg-blue-50">
                <Link href="/listing">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <span>Browse Courses</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col space-y-2 hover:bg-green-50">
                <Link href="/cart">
                  <Users className="h-6 w-6 text-green-600" />
                  <span>Demo Sessions</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col space-y-2 hover:bg-purple-50">
                <Link href="/profile">
                  <Target className="h-6 w-6 text-purple-600" />
                  <span>My Profile</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col space-y-2 hover:bg-orange-50">
                <Link href="/contact-us">
                  <Award className="h-6 w-6 text-orange-600" />
                  <span>Get Help</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;