"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageLoader } from '@/components/ui/loader';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserRole } from '@/types/auth';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Target,
  Clock, 
  Globe, 
  Users,
  Edit,
  Camera,
  Settings,
  Shield,
  Download,
  Trash2,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Monitor,
  DollarSign,
  Heart,
  Award,
  Calendar,
  GraduationCap,
  Wifi,
  Car
} from 'lucide-react';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { profile, loading: profileLoading } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  if (status === 'loading' || profileLoading) {
    return <PageLoader text="Loading your profile..." />;
  }

  if (!session) {
    redirect('/login');
  }

  const userRole = session.user?.role as UserRole;
  const userRoles = session.user?.roles || [session.user?.role];
  const isAdmin = userRoles.includes('ADMIN');

  // Admin-specific profile view
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  Admin Profile
                </h1>
                <p className="text-muted-foreground">Manage your admin account and system access</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Admin Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              {/* Admin Profile Summary */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-200">
                        <Shield className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{session.user?.name}</CardTitle>
                  <p className="text-gray-600">{session.user?.email}</p>
                  <div className="flex justify-center mt-2">
                    <Badge className="bg-blue-600 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      System Administrator
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Full System Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>User Management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span>System Configuration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/admin-dashboard">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/admin-dashboard/users">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/admin-dashboard/approvals">
                      <Clock className="h-4 w-4 mr-2" />
                      Pending Approvals
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Admin Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* System Access */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    System Access & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">User Management</p>
                        <p className="text-sm text-green-700">Full Access</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">Content Management</p>
                        <p className="text-sm text-green-700">Full Access</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">System Settings</p>
                        <p className="text-sm text-green-700">Full Access</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">Analytics</p>
                        <p className="text-sm text-green-700">Full Access</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-card-foreground font-medium">{session.user?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <p className="text-card-foreground font-medium">{session.user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <p className="text-card-foreground font-medium">System Administrator</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Login History</p>
                      <p className="text-sm text-muted-foreground">View recent account activity</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link href="/profile/edit">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary Card */}
            <Card className="bg-card border-border">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-card-foreground">{session.user?.name || 'User'}</CardTitle>
                <p className="text-muted-foreground">{session.user?.email}</p>
                {profile?.profileCompleted ? (
                  <Badge variant="default" className="flex items-center gap-1 w-fit mx-auto">
                    <CheckCircle className="h-3 w-3" />
                    Profile Complete
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1 w-fit mx-auto text-amber-600 border-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    Profile Incomplete
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-card-foreground">{session.user?.email}</span>
                </div>
                
                {profile?.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-card-foreground">{profile.phoneNumber}</span>
                  </div>
                )}
                
                {profile?.city && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-card-foreground">{profile.city}</span>
                  </div>
                )}

                {profile?.classLevel && (
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-card-foreground">{profile.classLevel}</span>
                  </div>
                )}

                {!profile?.profileCompleted && (
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      Complete your profile to get personalized recommendations.
                      <Button asChild variant="link" className="h-auto p-0 ml-1 text-amber-600">
                        <Link href="/complete-profile">Complete now</Link>
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Data
                </Button>
                <div className="border-t border-border my-2" />
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            {/* Profile Stats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Profile Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profile Strength</span>
                  <span className="text-sm font-medium text-card-foreground">
                    {profile?.profileCompleted ? '100%' : '45%'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`bg-primary h-2 rounded-full transition-all duration-300 ${
                      profile?.profileCompleted ? 'w-full' : 'w-[45%]'
                    }`}
                  />
                </div>                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined
                  </span>
                  <span className="text-card-foreground">
                    Recently
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            {profile?.bio && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Academic Interests */}
            {(profile?.interests?.length || profile?.preferredSubjects?.length || profile?.learningGoals?.length) && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Academic Interests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.interests?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest: string, index: number) => (
                          <Badge key={index} variant="secondary">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile?.preferredSubjects?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Preferred Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredSubjects.map((subject: string, index: number) => (
                          <Badge key={index} variant="outline">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile?.learningGoals?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Learning Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.learningGoals.map((goal: string, index: number) => (
                          <Badge key={index} variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                            <Target className="h-3 w-3 mr-1" />
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile?.targetExams?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Target Exams</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.targetExams.map((exam: string, index: number) => (
                          <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Coaching Preferences */}
            {(profile?.coachingMode || profile?.studyLevel || profile?.batchSize || profile?.budgetRange) && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Coaching Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.coachingMode && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          {profile.coachingMode === 'Online' ? (
                            <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          ) : profile.coachingMode === 'Offline' ? (
                            <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Mode</p>
                          <p className="font-medium text-card-foreground">{profile.coachingMode}</p>
                        </div>
                      </div>
                    )}

                    {profile?.studyLevel && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Study Level</p>
                          <p className="font-medium text-card-foreground">{profile.studyLevel}</p>
                        </div>
                      </div>
                    )}

                    {profile?.batchSize && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                          <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Batch Size</p>
                          <p className="font-medium text-card-foreground">{profile.batchSize}</p>
                        </div>
                      </div>
                    )}

                    {profile?.budgetRange && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                          <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="font-medium text-card-foreground">{profile.budgetRange}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location & Timing Preferences */}
            {(profile?.preferredCities?.length || profile?.sessionTimings?.length || profile?.maxTravelDistance) && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location & Timing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.preferredCities?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Preferred Cities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredCities.map((city: string, index: number) => (
                          <Badge key={index} variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile?.sessionTimings?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preferred Timings
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.sessionTimings.map((timing: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                            {timing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.maxTravelDistance && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                          <Car className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Max Travel</p>
                          <p className="font-medium text-card-foreground">{profile.maxTravelDistance}</p>
                        </div>
                      </div>
                    )}

                    {profile?.transportMode && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                          <Car className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Transport</p>
                          <p className="font-medium text-card-foreground">{profile.transportMode}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technical Preferences (for online coaching) */}
            {(profile?.onlineClassFormat || profile?.devicePreference || profile?.internetSpeed) && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    Technical Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.onlineClassFormat && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-full">
                          <Monitor className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Class Format</p>
                          <p className="font-medium text-card-foreground">{profile.onlineClassFormat}</p>
                        </div>
                      </div>
                    )}

                    {profile?.devicePreference && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                          <Monitor className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Device</p>
                          <p className="font-medium text-card-foreground">{profile.devicePreference}</p>
                        </div>
                      </div>
                    )}

                    {profile?.internetSpeed && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                          <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Internet Speed</p>
                          <p className="font-medium text-card-foreground">{profile.internetSpeed}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!profile?.bio && 
             !profile?.interests?.length && 
             !profile?.preferredSubjects?.length && 
             !profile?.learningGoals?.length && 
             !profile?.coachingMode && (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-2">Complete Your Profile</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        Add more information about yourself to help us provide better coaching recommendations.
                      </p>
                      <Button asChild>
                        <Link href="/profile/edit">
                          Complete Profile
                        </Link>
                      </Button>
                    </div>
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

export default ProfilePage;