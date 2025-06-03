"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import Link from 'next/link';

const StudentDashboard = () => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {session.user?.name}! 🎓
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-primary mb-2">Enrolled Courses</h3>
            <p className="text-3xl font-bold text-foreground">5</p>
            <p className="text-sm text-muted-foreground">2 in progress</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-secondary mb-2">Study Hours</h3>
            <p className="text-3xl font-bold text-foreground">24</p>
            <p className="text-sm text-muted-foreground">This week</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-accent mb-2">Achievements</h3>
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">Certificates earned</p>
          </div>
        </div>

        {/* Current Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Current Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((course) => (
              <div key={course} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-full h-32 bg-coaching-gradient rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Course {course}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Advanced Mathematics</h3>
                <p className="text-sm text-muted-foreground mb-4">Progress: 65%</p>
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="bg-coaching-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Continue Learning
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="h-20 flex flex-col space-y-2">
            <Link href="/courses">
              <span className="text-2xl">📚</span>
              <span>Browse Courses</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/cart">
              <span className="text-2xl">🛒</span>
              <span>View Cart</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/profile">
              <span className="text-2xl">👤</span>
              <span>Profile</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/help">
              <span className="text-2xl">❓</span>
              <span>Get Help</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;