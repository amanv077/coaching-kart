"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CoachDashboard = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!session) {
    redirect('/login');
  }

  // Check if user has COACH role (users can have multiple roles)
  const userRoles = session.user?.roles || [session.user?.role];
  const hasCoachRole = userRoles.includes('COACH');
  
  if (!hasCoachRole) {
    // Redirect to appropriate dashboard based on primary role
    const primaryRole = session.user?.role;
    if (primaryRole === 'STUDENT') {
      redirect('/dashboard');
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
            Coach Dashboard - {session.user?.name} 🏆
          </h1>
          <p className="text-muted-foreground">
            Manage your courses and help students achieve their goals
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-primary mb-2">Active Students</h3>
            <p className="text-3xl font-bold text-foreground">127</p>
            <p className="text-sm text-muted-foreground">+12 this week</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-secondary mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-foreground">8</p>
            <p className="text-sm text-muted-foreground">3 in development</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-accent mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-foreground">$2,450</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-primary mb-2">Rating</h3>
            <p className="text-3xl font-bold text-foreground">4.8</p>
            <p className="text-sm text-muted-foreground">⭐⭐⭐⭐⭐</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Student Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((activity) => (
                <div key={activity} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-coaching-gradient rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">S{activity}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Student completed Chapter {activity}</p>
                    <p className="text-sm text-muted-foreground">Advanced Mathematics Course</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((session) => (
                <div key={session} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">1-on-1 Session</p>
                    <p className="text-sm text-muted-foreground">with John Doe</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-coaching-primary">Today 3:00 PM</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Management */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((course) => (
              <div key={course} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-full h-32 bg-coaching-gradient rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Course {course}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Advanced Mathematics</h3>
                <p className="text-sm text-muted-foreground mb-2">45 enrolled students</p>
                <p className="text-sm text-coaching-secondary mb-4">$89.99</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="h-20 flex flex-col space-y-2">
            <Link href="/create-course">
              <span className="text-2xl">➕</span>
              <span>Create Course</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/students">
              <span className="text-2xl">👥</span>
              <span>Manage Students</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/analytics">
              <span className="text-2xl">📊</span>
              <span>Analytics</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/profile">
              <span className="text-2xl">👤</span>
              <span>Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;