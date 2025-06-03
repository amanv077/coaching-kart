"use client";

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
  Eye,
  Building2,
  Clock,
  Lock,
  BookOpen,
  Award
} from 'lucide-react';

interface PublicCoachingCardProps {
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
      approved: boolean;
      isActive: boolean;
      verificationStatus: 'Pending' | 'Verified' | 'Rejected';
      courses: Array<{
        id: string;
        courseName: string;
        courseAmount: number;
        rating?: number;
        totalRatings?: number;
      }>;
      subjectsOffered: string[];
      examsOffered: string[];
      facilities: string[];
    }>;
  };
  variant?: 'default' | 'compact';
}

const PublicCoachingCard: React.FC<PublicCoachingCardProps> = ({ 
  coaching, 
  variant = 'default' 
}) => {
  const { data: session } = useSession();
  
  // Defensive checks for profiles
  const hasProfiles = coaching.profiles && coaching.profiles.length > 0;
  const mainProfile = hasProfiles ? coaching.profiles[0] : null;
  const totalCourses = hasProfiles 
    ? coaching.profiles.reduce((acc, profile) => acc + (profile.courses?.length || 0), 0)
    : 0;

  // Calculate average rating from all courses
  const calculateAverageRating = () => {
    if (!hasProfiles) return { rating: 0, totalRatings: 0 };
    
    let totalRating = 0;
    let totalRatingsCount = 0;
    let courseCount = 0;
    
    coaching.profiles.forEach(profile => {
      profile.courses?.forEach(course => {
        if (course.rating && course.rating > 0) {
          totalRating += course.rating;
          courseCount++;
          totalRatingsCount += course.totalRatings || 0;
        }
      });
    });
    
    return {
      rating: courseCount > 0 ? Number((totalRating / courseCount).toFixed(1)) : 0,
      totalRatings: totalRatingsCount
    };
  };

  const { rating, totalRatings } = calculateAverageRating();

  // If no profiles exist, show a minimal card
  if (!hasProfiles) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {coaching.organizationName}
              </h3>
              <p className="text-sm text-gray-500">No profile data available</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>0 Branches</span>
                <span>0 Courses</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ContactInfo = ({ icon: Icon, value, isProtected = false }: {
    icon: React.ElementType;
    value: string;
    isProtected?: boolean;
  }) => {
    if (isProtected && !session) {
      return (
        <div className="flex items-center gap-2 text-gray-600">
          <Icon className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3" />
            <span className="text-sm">Login to view</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Icon className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{value}</span>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              {mainProfile?.logo ? (
                <img 
                  src={getOptimizedImageUrl(mainProfile.logo, 64, 64, 'auto')} 
                  alt={getImageAlt(mainProfile.logo, coaching.organizationName)}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <Building2 className="h-8 w-8 text-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {coaching.organizationName}
                  </h3>
                  <p className="text-sm text-gray-600">{mainProfile?.name || 'No profile name'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {mainProfile?.city && mainProfile?.state ? `${mainProfile.city}, ${mainProfile.state}` : 'Location not specified'}
                    </span>
                  </div>
                </div>
                {mainProfile?.verificationStatus === 'Verified' && (
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>{coaching.profiles?.length || 0} Branch{(coaching.profiles?.length || 0) > 1 ? 'es' : ''}</span>
                <span>{totalCourses} Course{totalCourses > 1 ? 's' : ''}</span>
                {rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span>{rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            {mainProfile?.logo ? (
              <img 
                src={getOptimizedImageUrl(mainProfile.logo, 80, 80, 'auto')} 
                alt={getImageAlt(mainProfile.logo, coaching.organizationName)}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
            ) : (
              <Building2 className="h-10 w-10 text-white" />
            )}
          </div>

          {/* Header Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {coaching.organizationName}
                </h3>
                <p className="text-gray-600 font-medium">{mainProfile?.name || 'No profile name'}</p>
                {mainProfile?.tagline && (
                  <p className="text-sm text-gray-500 italic mt-1">{mainProfile.tagline}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {mainProfile?.verificationStatus === 'Verified' && (
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}                {rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{rating}</span>
                    {totalRatings > 0 && (
                      <span className="text-xs text-gray-500">({totalRatings})</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
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
                <BookOpen className="h-4 w-4" />
                <span>{totalCourses} Course{totalCourses > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {mainProfile?.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{mainProfile.description}</p>
        )}

        {/* Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>
              {mainProfile?.city && mainProfile?.state 
                ? `${mainProfile.city}, ${mainProfile.state}` 
                : 'Location not specified'
              }
            </span>
          </div>
          <ContactInfo 
            icon={Phone} 
            value={mainProfile?.contactNumber || 'Not provided'} 
            isProtected={true}
          />
          <ContactInfo 
            icon={Mail} 
            value={mainProfile?.email || 'Not provided'} 
            isProtected={true}
          />
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Active</span>
          </div>
        </div>

        {/* Subjects & Exams */}
        {mainProfile && (
          <div className="space-y-2">
            {mainProfile.subjectsOffered && mainProfile.subjectsOffered.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Subjects: </span>
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
                <span className="text-sm font-medium text-gray-700">Exams: </span>
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
        )}

        {/* Course Price Range */}
        {mainProfile?.courses && mainProfile.courses.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-700 font-medium">Course Fees: </span>
            <span className="text-green-600 font-semibold">
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
          {!session && (
            <Button variant="default" size="sm" className="flex-1" asChild>
              <Link href="/login">
                <Lock className="h-4 w-4 mr-2" />
                Login to Contact
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicCoachingCard;
