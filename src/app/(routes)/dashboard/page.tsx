"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProfileCompletionPrompt } from '@/components/common/ProfileCompletionPrompt';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Award, TrendingUp, Calendar, Users, Target, Star, Search } from 'lucide-react';
import Link from 'next/link';

// Skeleton Components
const SkeletonStatCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
        <div className="h-7 w-12 bg-gray-200 rounded mb-1"></div>
        <div className="h-2 w-16 bg-gray-100 rounded"></div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const SkeletonCourseCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
    <div className="h-5 w-36 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 w-24 bg-gray-100 rounded mb-4"></div>
    <div className="h-2 w-full bg-gray-100 rounded mb-3"></div>
    <div className="h-3 w-32 bg-gray-100 rounded mb-4"></div>
    <div className="h-9 w-full bg-gray-200 rounded-lg"></div>
  </div>
);

const SkeletonQuickAction = () => (
  <div className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-6">
      {/* Header Skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-56 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-72 bg-gray-100 rounded"></div>
          </div>
          <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Courses Skeleton */}
      <div className="mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCourseCard />
          <SkeletonCourseCard />
          <SkeletonCourseCard />
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div>
        <div className="h-6 w-28 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SkeletonQuickAction />
          <SkeletonQuickAction />
          <SkeletonQuickAction />
          <SkeletonQuickAction />
        </div>
      </div>
    </div>
  </div>
);

const StudentDashboard = () => {
  const { data: session, status } = useSession();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showProfilePrompt, setShowProfilePrompt] = useState(true);

  // Show skeleton while loading
  if (status === 'loading' || profileLoading) {
    return <DashboardSkeleton />;
  }

  if (!session) {
    redirect('/login');
  }

  // Check if user has STUDENT role
  const userRoles = session.user?.roles || [session.user?.role];
  const hasStudentRole = userRoles.includes('STUDENT');
  
  if (!hasStudentRole) {
    const primaryRole = session.user?.role;
    if (primaryRole === 'COACH') redirect('/coaching-dashboard');
    else if (primaryRole === 'ADMIN') redirect('/admin-dashboard');
    else redirect('/');
  }

  const shouldShowProfilePrompt = !profile?.profileCompleted && showProfilePrompt;

  const stats = [
    { label: 'Enrolled', value: '5', sub: '2 active', icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'Hours', value: '24', sub: 'This week', icon: Clock, color: 'bg-green-50 text-green-600' },
    { label: 'Achievements', value: '12', sub: 'Earned', icon: Award, color: 'bg-purple-50 text-purple-600' },
    { label: 'Progress', value: '85%', sub: '+12% ↑', icon: Target, color: 'bg-orange-50 text-orange-600' },
  ];

  const courses = [
    { name: 'Advanced Mathematics', instructor: 'Dr. Sharma', progress: 65, next: 'Tomorrow 10 AM' },
    { name: 'Physics Fundamentals', instructor: 'Prof. Kumar', progress: 80, next: 'Today 3 PM' },
    { name: 'Chemistry Mastery', instructor: 'Dr. Patel', progress: 45, next: 'Friday 11 AM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {session.user?.name?.split(' ')[0]}! 🎓
            </h1>
            <p className="text-gray-500 mt-1">
              {profile?.profileCompleted 
                ? "Ready to continue learning?"
                : "Complete your profile for personalized recommendations"
              }
            </p>
          </div>
          {profile?.profileCompleted && (
            <Badge className="bg-green-100 text-green-700 border-0">Profile Complete</Badge>
          )}
        </div>

        {/* Profile Prompt */}
        {shouldShowProfilePrompt && (
          <ProfileCompletionPrompt onDismiss={() => setShowProfilePrompt(false)} />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Courses */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
            <Link href="/courses" className="text-sm text-[#0F52BA] font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.name} className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
                <p className="text-sm text-gray-500 mb-3">by {course.instructor}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="bg-[#0F52BA] h-1.5 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Next: {course.next}</span>
                </div>

                <Button size="sm" className="w-full bg-[#0F52BA] hover:bg-[#0A3D8F]">
                  Continue
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Search, label: 'Find Coaching', href: '/coaching', color: 'text-blue-600' },
              { icon: Calendar, label: 'Demo Sessions', href: '/demo-sessions', color: 'text-green-600' },
              { icon: Users, label: 'My Profile', href: '/profile', color: 'text-purple-600' },
              { icon: Star, label: 'Get Help', href: '/contact-us', color: 'text-orange-600' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center hover:shadow-md hover:border-gray-300 transition-all"
              >
                <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;