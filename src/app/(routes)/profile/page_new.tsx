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

            {/* Coaching Preferences */}
            {profile?.profileCompleted && userRole === 'STUDENT' && (
              <>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Coaching Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Coaching Mode */}
                    {profile.coachingMode && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                          {profile.coachingMode === 'Online' && <Monitor className="h-4 w-4" />}
                          {profile.coachingMode === 'Offline' && <Users className="h-4 w-4" />}
                          {profile.coachingMode === 'Both' && <Globe className="h-4 w-4" />}
                          Preferred Mode: {profile.coachingMode}
                        </h4>
                      </div>
                    )}

                    {/* Study Level */}
                    {profile.studyLevel && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Study Level
                        </h4>
                        <Badge variant="secondary">{profile.studyLevel}</Badge>
                      </div>
                    )}

                    {/* Budget Range */}
                    {profile.budgetRange && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Budget Range
                        </h4>
                        <p className="text-card-foreground">{profile.budgetRange}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Subjects & Interests */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Academic Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Interests */}
                    {profile.interests && profile.interests.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Interests
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preferred Subjects */}
                    {profile.preferredSubjects && profile.preferredSubjects.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Preferred Subjects
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.preferredSubjects.map((subject: string, index: number) => (
                            <Badge key={index} variant="default">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Target Exams */}
                    {profile.targetExams && profile.targetExams.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Target Exams
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.targetExams.map((exam: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {exam}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Goals */}
                    {profile.learningGoals && profile.learningGoals.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Learning Goals
                        </h4>
                        <div className="space-y-1">
                          {profile.learningGoals.map((goal: string, index: number) => (
                            <p key={index} className="text-card-foreground">• {goal}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Location & Timing Preferences */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Location & Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Preferred Cities */}
                    {profile.preferredCities && profile.preferredCities.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Preferred Cities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.preferredCities.map((city: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {city}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Session Timings */}
                    {profile.sessionTimings && profile.sessionTimings.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Preferred Timings
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.sessionTimings.map((timing: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {timing}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Travel Distance & Transport (for offline) */}
                    {(profile.coachingMode === 'Offline' || profile.coachingMode === 'Both') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.maxTravelDistance && (
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              Max Travel Distance
                            </h4>
                            <Badge variant="outline">{profile.maxTravelDistance}</Badge>
                          </div>
                        )}
                        {profile.transportMode && (
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              Transport Mode
                            </h4>
                            <Badge variant="outline">{profile.transportMode}</Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Batch Size Preference */}
                    {profile.batchSize && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Batch Size Preference
                        </h4>
                        <Badge variant="outline">{profile.batchSize}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Online Preferences */}
                {(profile.coachingMode === 'Online' || profile.coachingMode === 'Both') && (
                  profile.onlineClassFormat || profile.devicePreference || profile.internetSpeed
                ) && (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-primary" />
                        Online Learning Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.onlineClassFormat && (
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              Class Format
                            </h4>
                            <Badge variant="outline">{profile.onlineClassFormat}</Badge>
                          </div>
                        )}
                        {profile.devicePreference && (
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              Device Preference
                            </h4>
                            <Badge variant="outline">{profile.devicePreference}</Badge>
                          </div>
                        )}
                        {profile.internetSpeed && (
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                              <Wifi className="h-4 w-4" />
                              Internet Speed
                            </h4>
                            <Badge variant="outline">{profile.internetSpeed}</Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Basic Learning Preferences for incomplete profiles */}
            {userRole === 'STUDENT' && !profile?.profileCompleted && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Class Level</h4>
                      <p className="text-card-foreground">{profile?.classLevel || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Age</h4>
                      <p className="text-card-foreground">{profile?.age || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">School/College</h4>
                      <p className="text-card-foreground">{profile?.schoolOrCollege || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Looking For</h4>
                      <p className="text-card-foreground">{profile?.lookingFor || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                      Complete your profile to unlock personalized coaching recommendations and advanced features.
                      <Button asChild variant="link" className="h-auto p-0 ml-1 text-blue-600">
                        <Link href="/complete-profile">Complete Profile</Link>
                      </Button>
                    </AlertDescription>
                  </Alert>
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
