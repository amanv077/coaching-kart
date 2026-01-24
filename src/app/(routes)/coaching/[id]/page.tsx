"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Phone, Mail, Globe, Calendar, Users, BookOpen, Award, 
  Clock, Star, CheckCircle, Building2, Edit, ArrowLeft,
  Image as ImageIcon, User, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface CoachingData {
  id: string;
  coachingId: string;
  organizationName: string;
  ownerUserId: string;
  approved: boolean;
  isActive: boolean;
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
    website?: string;
    address: string;
    pincode: string;
    operatingDays: string[];
    operatingHours: string;
    rating?: number;
    totalRatings?: number;
    verificationStatus: 'Pending' | 'Verified' | 'Rejected';
    subjectsOffered: string[];
    examsOffered: string[];
    facilities: string[];
    courses: Array<{
      id: string;
      courseName: string;
      courseAmount: number;
    }>;
    teachers: Array<{
      id: string;
      name: string;
      qualification: string;
      experience: number;
      profileImage?: string;
      bio?: string;
      specialization?: string[];
    }>;
  }>;
}

// Section Component for consistent styling
const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
      <Icon className="w-5 h-5 text-[#0F52BA]" />
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const CoachingDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [coaching, setCoaching] = useState<CoachingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coachingId = params?.id as string;

  useEffect(() => {
    if (coachingId) fetchCoachingDetails();
  }, [coachingId]);

  const fetchCoachingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coaching/${coachingId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCoaching(data);
    } catch (error) {
      setError('Failed to load coaching details');
      toast.error('Failed to load coaching details');
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="animate-pulse">
              <div className="h-6 w-16 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-7 w-2/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-4 space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !coaching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 text-center max-w-sm w-full">
          <h2 className="text-lg font-semibold mb-2">Coaching Not Found</h2>
          <p className="text-gray-500 mb-4 text-sm">The coaching you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id && session.user.id === coaching.ownerUserId;
  const mainProfile = coaching.profiles?.[0];
  const minPrice = mainProfile?.courses?.length 
    ? Math.min(...mainProfile.courses.map(c => c.courseAmount)) 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center text-sm font-medium text-[#0F52BA] bg-[#0F52BA]/10 hover:bg-[#0F52BA]/20 px-3 py-1.5 rounded-full mb-3 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </button>
          
          {/* Institute Info */}
          <div className="flex gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0F52BA] rounded-xl flex items-center justify-center flex-shrink-0">
              {mainProfile?.logo ? (
                <img src={mainProfile.logo} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {coaching.organizationName}
              </h1>
              {mainProfile?.tagline && (
                <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">{mainProfile.tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {mainProfile?.city}, {mainProfile?.state}
                </span>
                {mainProfile?.verificationStatus === 'Verified' && (
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    <Award className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {mainProfile?.establishedYear && (
            <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
              <Calendar className="w-5 h-5 text-[#0F52BA] mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{mainProfile.establishedYear}</p>
              <p className="text-xs text-gray-500">Established</p>
            </div>
          )}
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
            <BookOpen className="w-5 h-5 text-[#0F52BA] mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{mainProfile?.courses?.length || 0}</p>
            <p className="text-xs text-gray-500">Courses</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
            <Users className="w-5 h-5 text-[#0F52BA] mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{mainProfile?.teachers?.length || 0}</p>
            <p className="text-xs text-gray-500">Teachers</p>
          </div>
        </div>

        {/* About */}
        {mainProfile?.description && (
          <Section title="About" icon={Building2}>
            <p className="text-gray-600 text-sm leading-relaxed">{mainProfile.description}</p>
          </Section>
        )}

        {/* Exams & Subjects */}
        {(mainProfile?.examsOffered?.length > 0 || mainProfile?.subjectsOffered?.length > 0) && (
          <Section title="Exams & Subjects" icon={Award}>
            {mainProfile?.examsOffered?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-2">EXAM PREPARATION</p>
                <div className="flex flex-wrap gap-1.5">
                  {mainProfile.examsOffered.map((exam, i) => (
                    <Badge key={i} className="bg-[#0F52BA]/10 text-[#0F52BA] border-0 text-xs">{exam}</Badge>
                  ))}
                </div>
              </div>
            )}
            {mainProfile?.subjectsOffered?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">SUBJECTS</p>
                <div className="flex flex-wrap gap-1.5">
                  {mainProfile.subjectsOffered.map((subject, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-gray-200">{subject}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Courses */}
        {mainProfile?.courses?.length > 0 && (
          <Section title="Courses" icon={BookOpen}>
            <div className="space-y-2">
              {mainProfile.courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900 text-sm">{course.courseName}</span>
                  <span className="font-bold text-[#0F52BA]">₹{course.courseAmount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Gallery - Horizontal Slider */}
        {mainProfile?.images?.length > 0 && (
          <Section title="Gallery" icon={ImageIcon}>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {mainProfile.images.map((img, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-64 h-44 rounded-xl overflow-hidden bg-gray-100 snap-start cursor-pointer"
                  onClick={() => window.open(img, '_blank')}
                >
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
            {mainProfile.images.length > 3 && (
              <p className="text-xs text-gray-400 text-center mt-2">Swipe to see more →</p>
            )}
          </Section>
        )}

        {/* Teachers */}
        {mainProfile?.teachers?.length > 0 && (
          <Section title="Faculty" icon={Users}>
            <div className="space-y-3">
              {mainProfile.teachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0F52BA] rounded-full flex items-center justify-center flex-shrink-0">
                    {teacher.profileImage ? (
                      <img src={teacher.profileImage} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-white font-semibold">{teacher.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.qualification} • {teacher.experience} yrs exp</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Contact & Location */}
        <Section title="Contact & Location" icon={MapPin}>
          <div className="space-y-3 text-sm">
            {mainProfile?.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">{mainProfile.address}</p>
                  <p className="text-gray-500">{mainProfile.city}, {mainProfile.state} - {mainProfile.pincode}</p>
                </div>
              </div>
            )}
            {session?.user && mainProfile?.contactNumber && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${mainProfile.contactNumber}`} className="text-[#0F52BA]">{mainProfile.contactNumber}</a>
              </div>
            )}
            {session?.user && mainProfile?.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${mainProfile.email}`} className="text-[#0F52BA]">{mainProfile.email}</a>
              </div>
            )}
            {mainProfile?.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <a href={mainProfile.website} target="_blank" rel="noopener noreferrer" className="text-[#0F52BA]">Visit Website</a>
              </div>
            )}
            {!session?.user && (
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Link href="/login" className="text-[#0F52BA] font-medium">Login</Link> to view contact details
              </p>
            )}
          </div>
        </Section>

        {/* Facilities */}
        {mainProfile?.facilities?.length > 0 && (
          <Section title="Facilities" icon={CheckCircle}>
            <div className="grid grid-cols-2 gap-2">
              {mainProfile.facilities.map((facility, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{facility}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Operating Hours */}
        {mainProfile?.operatingHours && (
          <Section title="Timings" icon={Clock}>
            <p className="text-sm text-gray-600">{mainProfile.operatingHours}</p>
            {mainProfile.operatingDays?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {mainProfile.operatingDays.map((day, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{day}</Badge>
                ))}
              </div>
            )}
          </Section>
        )}
      </div>

      {/* Sticky Bottom CTA - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40">
        <div className="flex gap-3">
          {!session?.user && (
            <Button asChild className="flex-1 bg-[#0F52BA] hover:bg-[#0A3D8F]">
              <Link href="/login">
                <User className="w-4 h-4 mr-2" /> Login to Apply
              </Link>
            </Button>
          )}
          {session?.user && !isOwner && (
            <>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`tel:${mainProfile?.contactNumber}`}>
                  <Phone className="w-4 h-4 mr-2" /> Call
                </Link>
              </Button>
              <Button asChild className="flex-1 bg-[#0F52BA] hover:bg-[#0A3D8F]">
                <Link href={`/demo-booking/${coaching.coachingId}`}>
                  <Calendar className="w-4 h-4 mr-2" /> Book Demo
                </Link>
              </Button>
            </>
          )}
          {isOwner && (
            <Button asChild className="flex-1 bg-[#0F52BA] hover:bg-[#0A3D8F]">
              <Link href={`/coaching-dashboard/manage/${coaching.coachingId}`}>
                <Edit className="w-4 h-4 mr-2" /> Edit Details
              </Link>
            </Button>
          )}
        </div>
        {minPrice && (
          <p className="text-center text-xs text-gray-500 mt-2">
            Courses starting from <span className="font-bold text-[#0F52BA]">₹{minPrice.toLocaleString()}</span>
          </p>
        )}
      </div>

      {/* Desktop CTA - Hidden on mobile */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-72">
          <div className="text-center mb-3">
            {minPrice && (
              <p className="text-sm text-gray-500">Starting from <span className="text-xl font-bold text-[#0F52BA]">₹{minPrice.toLocaleString()}</span></p>
            )}
          </div>
          <div className="space-y-2">
            {!session?.user && (
              <Button asChild className="w-full bg-[#0F52BA] hover:bg-[#0A3D8F]">
                <Link href="/login"><User className="w-4 h-4 mr-2" /> Login to Apply</Link>
              </Button>
            )}
            {session?.user && !isOwner && (
              <>
                <Button asChild className="w-full bg-[#0F52BA] hover:bg-[#0A3D8F]">
                  <Link href={`/demo-booking/${coaching.coachingId}`}><Calendar className="w-4 h-4 mr-2" /> Book Demo</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`tel:${mainProfile?.contactNumber}`}><Phone className="w-4 h-4 mr-2" /> Contact Now</Link>
                </Button>
              </>
            )}
            {isOwner && (
              <Button asChild className="w-full bg-[#0F52BA] hover:bg-[#0A3D8F]">
                <Link href={`/coaching-dashboard/manage/${coaching.coachingId}`}><Edit className="w-4 h-4 mr-2" /> Edit Details</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingDetailPage;
