"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Star
} from 'lucide-react';
import { getOptimizedImageUrl, getImageAlt } from '@/utils/image-utils';

interface PendingCoachingProfile {
  id: string;
  profileId: string;
  name: string;
  branchName?: string;
  establishedYear: number;
  tagline?: string;
  description: string;
  logo?: string;
  images: string[];
  address: string;
  city: string;
  state: string;
  contactNumber: string;
  email: string;
  subjectsOffered: string[];
  examsOffered: string[];
  facilities: string[];
  coaching: {
    organizationName: string;
    ownerName: string;
    ownerEmail: string;
    businessType: string;
  };
  courses: Array<{
    id: string;
    courseName: string;
    courseAmount: number;
  }>;
  createdAt: string;
}

interface PendingApprovalsProps {
  pendingProfiles: PendingCoachingProfile[];
  onApprove: (profileId: string) => void;
  onReject: (profileId: string) => void;
  isLoading?: boolean;
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({ 
  pendingProfiles, 
  onApprove, 
  onReject, 
  isLoading = false 
}) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (pendingProfiles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            All Caught Up!
          </h3>
          <p className="text-muted-foreground">
            No pending coaching profiles to review at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pendingProfiles.map((profile) => (
        <Card key={profile.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {profile.logo ? (
                    <img 
                      src={getOptimizedImageUrl(profile.logo, 64, 64, 'auto')} 
                      alt={getImageAlt(profile.logo, profile.name)}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-white" />
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {profile.coaching.organizationName}
                    </h3>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <p className="text-lg font-medium text-muted-foreground mb-1">
                    {profile.name}
                  </p>
                  {profile.tagline && (
                    <p className="text-sm text-muted-foreground italic mb-2">
                      {profile.tagline}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Est. {profile.establishedYear}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.city}, {profile.state}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{profile.courses.length} Courses</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProfile(
                    selectedProfile === profile.id ? null : profile.id
                  )}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {selectedProfile === profile.id ? 'Hide' : 'View'} Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onReject(profile.id)}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(profile.id)}
                  disabled={isLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Expanded Details */}
          {selectedProfile === profile.id && (
            <CardContent className="border-t pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {profile.description}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.contactNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{profile.address}, {profile.city}, {profile.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Owner Information */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Owner Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {profile.coaching.ownerName}</p>
                      <p><span className="font-medium">Email:</span> {profile.coaching.ownerEmail}</p>
                      <p><span className="font-medium">Business Type:</span> {profile.coaching.businessType}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Subjects & Exams */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Subjects Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.subjectsOffered.map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Exams Prepared</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.examsOffered.map((exam) => (
                        <Badge key={exam} variant="outline" className="text-xs">
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.facilities.map((facility) => (
                        <Badge key={facility} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Courses */}
                  {profile.courses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Courses ({profile.courses.length})</h4>
                      <div className="space-y-2">
                        {profile.courses.slice(0, 3).map((course) => (
                          <div key={course.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium">{course.courseName}</span>
                            <span className="text-sm font-bold text-green-600">
                              ₹{course.courseAmount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {profile.courses.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{profile.courses.length - 3} more courses
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submission Date */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Submitted</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(profile.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PendingApprovals;
