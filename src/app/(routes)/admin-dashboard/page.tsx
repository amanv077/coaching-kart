"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import Link from 'next/link';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <PageLoader text="Loading admin dashboard..." />;
  }
  if (!session) {
    redirect('/login');
  }

  // Check if user has ADMIN role (users can have multiple roles)
  const userRoles = session.user?.roles || [session.user?.role];
  const hasAdminRole = userRoles.includes('ADMIN');
  
  if (!hasAdminRole) {
    // Redirect to appropriate dashboard based on primary role
    const primaryRole = session.user?.role;
    if (primaryRole === 'STUDENT') {
      redirect('/dashboard');
    } else if (primaryRole === 'COACH') {
      redirect('/coaching-dashboard');
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
            Admin Dashboard - {session.user?.name} ⚡
          </h1>
          <p className="text-muted-foreground">
            Manage the entire platform and oversee all operations
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-primary mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-foreground">2,847</p>
            <p className="text-sm text-muted-foreground">+127 this month</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-secondary mb-2">Active Coaches</h3>
            <p className="text-3xl font-bold text-foreground">156</p>
            <p className="text-sm text-muted-foreground">95% active rate</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-accent mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-foreground">234</p>
            <p className="text-sm text-muted-foreground">12 pending approval</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-primary mb-2">Platform Revenue</h3>
            <p className="text-3xl font-bold text-foreground">$45K</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-coaching-secondary mb-2">Support Tickets</h3>
            <p className="text-3xl font-bold text-foreground">23</p>
            <p className="text-sm text-muted-foreground">5 urgent</p>
          </div>
        </div>

        {/* Recent Activity & Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Pending Approvals</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-coaching-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">C{item}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">New Course Submission</p>
                      <p className="text-sm text-muted-foreground">Advanced Physics by Dr. Smith</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                    <Button size="sm">
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Server Status</p>
                  <p className="text-sm text-green-600">All systems operational</p>
                </div>
                <span className="text-green-500 text-2xl">✅</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Database Performance</p>
                  <p className="text-sm text-blue-600">Optimal response times</p>
                </div>
                <span className="text-blue-500 text-2xl">🚀</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800">Backup Status</p>
                  <p className="text-sm text-yellow-600">Last backup: 2 hours ago</p>
                </div>
                <span className="text-yellow-500 text-2xl">💾</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Recent User Registrations</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((user) => (
                <div key={user} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-coaching-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">U{user}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">John Doe {user}</p>
                      <p className="text-sm text-muted-foreground">john.doe{user}@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm bg-coaching-secondary/20 text-coaching-secondary px-2 py-1 rounded">
                      STUDENT
                    </span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Button asChild className="h-20 flex flex-col space-y-2">
            <Link href="/admin/users">
              <span className="text-2xl">👥</span>
              <span>Manage Users</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/admin/courses">
              <span className="text-2xl">📚</span>
              <span>Course Management</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/admin/analytics">
              <span className="text-2xl">📊</span>
              <span>Analytics</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/admin/settings">
              <span className="text-2xl">⚙️</span>
              <span>Settings</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col space-y-2">
            <Link href="/admin/reports">
              <span className="text-2xl">📄</span>
              <span>Reports</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;