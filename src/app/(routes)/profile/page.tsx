"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);

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

  const userRole = session.user?.role as UserRole;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={session.user?.name || ''}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-foreground">{session.user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <p className="text-foreground">{session.user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-coaching-secondary/20 text-coaching-secondary">
                    {userRole}
                  </span>
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Role-specific sections */}
            {userRole === 'COACH' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Coach Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Tell students about your experience and teaching approach..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            )}

            {userRole === 'STUDENT' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Learning Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Interested Subjects
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map((subject) => (
                        <button
                          key={subject}
                          className="px-3 py-1 text-sm border border-border rounded-full hover:bg-coaching-primary/10 transition-colors"
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Learning Goal
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="What do you want to achieve through coaching?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Password</p>
                    <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Avatar */}
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-coaching-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h3 className="font-bold text-foreground mb-1">{session.user?.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{session.user?.email}</p>
              <Button variant="outline" size="sm" className="w-full">
                Upload Photo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-4">Account Stats</h3>
              <div className="space-y-3">
                {userRole === 'STUDENT' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Courses Enrolled</span>
                      <span className="font-medium text-foreground">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certificates</span>
                      <span className="font-medium text-foreground">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Study Hours</span>
                      <span className="font-medium text-foreground">156h</span>
                    </div>
                  </>
                )}
                {userRole === 'COACH' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Students</span>
                      <span className="font-medium text-foreground">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Courses Created</span>
                      <span className="font-medium text-foreground">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium text-foreground">4.8/5</span>
                    </div>
                  </>
                )}
                {userRole === 'ADMIN' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Users</span>
                      <span className="font-medium text-foreground">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Coaches</span>
                      <span className="font-medium text-foreground">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Health</span>
                      <span className="font-medium text-green-600">Excellent</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium text-foreground">Dec 2024</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📧 Contact Support
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📋 Download Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                  🗑️ Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
