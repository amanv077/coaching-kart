"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getOptimizedImageUrl, getImageAlt } from '@/utils/image-utils';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Star, 
  Edit, 
  Eye,
  Building2,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface CoachingCardProps {
  coaching: {
    id: string;
    coachingId: string;
    organizationName: string;
    profiles: Array<{
      id: string;
      profileId: string;
      name: string;
      branchName?: string;
      city: string;
      state: string;
      logo?: string;
      images: string[];
      tagline?: string;
      description: string;
      establishedYear: number;
      contactNumber: string;
      email: string;
      rating?: number;
      totalRatings?: number;
      approved: boolean;
      isActive: boolean;
      verificationStatus: 'Pending' | 'Verified' | 'Rejected';
      courses: Array<{
        id: string;
        courseName: string;
        courseAmount: number;
      }>;
      subjectsOffered: string[];
      examsOffered: string[];
      facilities: string[];
    }>;
  };
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

const CoachingCard: React.FC<CoachingCardProps> = ({ 
  coaching, 
  showActions = false, 
  variant = 'default' 
}) => {
  // Defensive checks for profiles
  const hasProfiles = coaching.profiles && coaching.profiles.length > 0;
  const mainProfile = hasProfiles ? coaching.profiles[0] : null;
  const totalCourses = hasProfiles 
    ? coaching.profiles.reduce((acc, profile) => acc + (profile.courses?.length || 0), 0)
    : 0;

  // If no profiles exist, show a minimal card with just organization info
  if (!hasProfiles) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">            <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="h-8 w-8 text-background" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {coaching.organizationName}
              </h3>
              <p className="text-sm text-muted-foreground">No profile data available</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>0 Branches</span>
                <span>0 Courses</span>
              </div>
              {showActions && (
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/coaching-dashboard/manage/${coaching.coachingId}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Setup Profile
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  const getStatusBadge = (status: string, approved: boolean, isActive: boolean) => {
    if (!isActive) {
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Inactive</Badge>;
    }
    if (!approved) {
      return <Badge variant="destructive">Pending Approval</Badge>;
    }
    switch (status) {
      case 'Verified':
        return <Badge variant="default" className="bg-[hsl(142_76%_90%)] text-[hsl(142_76%_25%)] dark:bg-[hsl(142_76%_30%)] dark:text-[hsl(142_76%_95%)]">Verified</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };
  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">            {/* Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-[hsl(205_100%_50%)] to-[hsl(226_70%_55%)] rounded-lg flex items-center justify-center flex-shrink-0">
              {mainProfile?.logo ? (
                <img 
                  src={getOptimizedImageUrl(mainProfile.logo, 64, 64, 'auto')} 
                  alt={getImageAlt(mainProfile.logo, coaching.organizationName)}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <Building2 className="h-8 w-8 text-background" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">                <div>
                  <h3 className="font-semibold text-lg text-foreground truncate">
                    {coaching.organizationName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{mainProfile?.name || 'No profile name'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted" />
                    <span className="text-sm text-muted-foreground">
                      {mainProfile?.city && mainProfile?.state ? `${mainProfile.city}, ${mainProfile.state}` : 'Location not specified'}
                    </span>
                  </div>
                </div>
                {mainProfile && getStatusBadge(mainProfile.verificationStatus, mainProfile.approved, mainProfile.isActive)}
              </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{coaching.profiles?.length || 0} Branch{(coaching.profiles?.length || 0) > 1 ? 'es' : ''}</span>
                <span>{totalCourses} Course{totalCourses > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/coaching-dashboard/manage/${coaching.coachingId}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">          {/* Logo */}            <div className="w-20 h-20 bg-gradient-to-br from-[hsl(205_100%_50%)] to-[hsl(226_70%_55%)] rounded-xl flex items-center justify-center flex-shrink-0">
              {mainProfile?.logo ? (
                <img 
                  src={getOptimizedImageUrl(mainProfile.logo, 80, 80, 'auto')} 
                  alt={getImageAlt(mainProfile.logo, coaching.organizationName)}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              ) : (
                <Building2 className="h-10 w-10 text-background" />
              )}
          </div>

          {/* Header Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>                <h3 className="text-xl font-bold text-foreground mb-1">
                  {coaching.organizationName}
                </h3>
                <p className="text-muted-foreground font-medium">{mainProfile?.name || 'No profile name'}</p>
                {mainProfile?.tagline && (
                  <p className="text-sm text-muted italic mt-1">{mainProfile.tagline}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {mainProfile && getStatusBadge(mainProfile.verificationStatus, mainProfile.approved, mainProfile.isActive)}                {mainProfile?.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-[hsl(48_100%_50%)] fill-current" />
                    <span className="text-sm font-medium">{mainProfile.rating}</span>
                    <span className="text-xs text-muted-foreground">({mainProfile.totalRatings})</span>
                  </div>
                )}
              </div>
            </div>            {/* Quick Stats */}
            <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
              {mainProfile?.establishedYear && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Est. {mainProfile.establishedYear}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{coaching.profiles?.length || 0} Branch{(coaching.profiles?.length || 0) > 1 ? 'es' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{totalCourses} Course{totalCourses > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>      <CardContent className="space-y-4">        {/* Description */}
        {mainProfile?.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">{mainProfile.description}</p>
        )}        {/* Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-muted" />
            <span>
              {mainProfile?.city && mainProfile?.state 
                ? `${mainProfile.city}, ${mainProfile.state}` 
                : 'Location not specified'
              }
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 text-muted" />
            <span>{mainProfile?.contactNumber || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-muted" />
            <span className="truncate">{mainProfile?.email || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-muted" />
            <span>Active</span>
          </div>
        </div>

        {/* Subjects & Exams */}
        {mainProfile && (
          <div className="space-y-2">
            {mainProfile.subjectsOffered && mainProfile.subjectsOffered.length > 0 && (
              <div>                <span className="text-sm font-medium text-foreground">Subjects: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mainProfile.subjectsOffered.slice(0, 4).map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {mainProfile.subjectsOffered.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{mainProfile.subjectsOffered.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {mainProfile.examsOffered && mainProfile.examsOffered.length > 0 && (
              <div>
                <span className="text-sm font-medium text-foreground">Exams: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mainProfile.examsOffered.slice(0, 3).map((exam) => (
                    <Badge key={exam} variant="outline" className="text-xs">
                      {exam}
                    </Badge>
                  ))}
                  {mainProfile.examsOffered.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mainProfile.examsOffered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}        {/* Course Price Range */}
        {mainProfile?.courses && mainProfile.courses.length > 0 && (
          <div className="text-sm">
            <span className="text-foreground font-medium">Course Fees: </span>
            <span className="text-[hsl(142_76%_36%)] dark:text-[hsl(142_76%_50%)] font-semibold">
              ₹{Math.min(...mainProfile.courses.map(c => c.courseAmount)).toLocaleString()} - 
              ₹{Math.max(...mainProfile.courses.map(c => c.courseAmount)).toLocaleString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/coaching/${coaching.coachingId}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          {showActions && (
            <Button variant="default" size="sm" className="flex-1" asChild>
              <Link href={`/coaching-dashboard/manage/${coaching.coachingId}`}>
                <Edit className="h-4 w-4 mr-2" />
                Manage
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachingCard;