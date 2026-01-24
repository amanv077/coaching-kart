"use client";

import { Button } from '@/components/ui/button';
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  Edit,
  ExternalLink,
  MapPin,
  Plus,
  Settings,
  Users
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface DashboardStats {
  totalCoachings: number;
  totalProfiles: number;
  totalCourses: number;
  totalStudents: number;
  pendingApprovals: number;
  monthlyEarnings: number;
}

interface CoachingData {
  id: string;
  coachingId: string;
  organizationName: string;
  approved: boolean;
  isActive: boolean;
  profiles: Array<{
    id: string;
    profileId: string;
    name: string;
    city: string;
    state: string;
    tagline?: string;
    verificationStatus: 'Pending' | 'Verified' | 'Rejected';
    courses: Array<{ id: string; courseName: string; courseAmount: number }>;
    examsOffered: string[];
  }>;
}

// Skeleton Components
const SkeletonStatCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
    <div className="w-9 h-9 bg-gray-200 rounded-lg mb-2"></div>
    <div className="h-7 w-12 bg-gray-200 rounded mb-1"></div>
    <div className="h-3 w-16 bg-gray-100 rounded"></div>
  </div>
);

const SkeletonQuickActions = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
    <div className="flex gap-2">
      <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-28 bg-gray-100 rounded-lg"></div>
      <div className="h-10 w-24 bg-gray-100 rounded-lg"></div>
    </div>
  </div>
);

const SkeletonCoachingCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-32 bg-gray-100 rounded"></div>
      </div>
      <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
    </div>
    <div className="flex gap-1.5 mb-3">
      <div className="h-5 w-12 bg-gray-100 rounded"></div>
      <div className="h-5 w-14 bg-gray-100 rounded"></div>
      <div className="h-5 w-10 bg-gray-100 rounded"></div>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="h-4 w-20 bg-gray-100 rounded"></div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
        <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-6">
      {/* Header Skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-100 rounded"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mb-6">
        <SkeletonQuickActions />
      </div>

      {/* Coachings Skeleton */}
      <div>
        <div className="h-5 w-28 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-4">
          <SkeletonCoachingCard />
          <SkeletonCoachingCard />
        </div>
      </div>
    </div>
  </div>
);

const CoachDashboard = () => {
  const { data: session, status } = useSession();
  const [coachings, setCoachings] = useState<CoachingData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCoachings: 0, totalProfiles: 0, totalCourses: 0,
    totalStudents: 0, pendingApprovals: 0, monthlyEarnings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user && status === 'authenticated') {
      fetch('/api/coaching/my-coachings')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) { setCoachings(data.coachings); setStats(data.stats); }
        })
        .finally(() => setIsLoading(false));
    }
  }, [session, status]);

  // Show skeleton while loading
  if (status === 'loading' || isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, {session?.user?.name?.split(' ')[0] || 'Coach'} 👋
          </h1>
          <p className="text-gray-500 mt-1">Manage your coaching institutes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="w-9 h-9 bg-[#0F52BA]/10 rounded-lg flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5 text-[#0F52BA]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCoachings}</p>
            <p className="text-xs text-gray-500">Coachings</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            <p className="text-xs text-gray-500">Courses</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            <p className="text-xs text-gray-500">Students</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
          <div className="flex gap-2 overflow-x-auto">
            <Link
              href="/newCoaching"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0F52BA] text-white rounded-lg text-sm font-medium whitespace-nowrap hover:bg-[#0A3D8F] transition-colors"
            >
              <Plus className="w-4 h-4" /> New Coaching
            </Link>
            <Link
              href="/coaching-dashboard/demo-slots"
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              <Calendar className="w-4 h-4" /> Demo Slots
            </Link>
            <Link
              href="/coaching-dashboard/settings"
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </div>
        </div>

        {/* My Coachings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Coachings</h2>
          </div>
          
          {coachings.length > 0 ? (
            <div className="space-y-4">
              {coachings.map((coaching) => {
                const profile = coaching.profiles?.[0];
                const courseCount = coaching.profiles?.reduce((a, p) => a + (p.courses?.length || 0), 0) || 0;
                const exams = profile?.examsOffered?.slice(0, 3) || [];
                
                return (
                  <div
                    key={coaching.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#0F52BA] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{coaching.organizationName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                          {profile && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {profile.city}, {profile.state}
                            </span>
                          )}
                        </div>
                      </div>
                      {profile?.verificationStatus === 'Verified' && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Award className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>

                    {/* Exams */}
                    {exams.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {exams.map(exam => (
                          <span key={exam} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {exam}
                          </span>
                        ))}
                        {(profile?.examsOffered?.length || 0) > 3 && (
                          <span className="text-xs text-gray-400">+{(profile?.examsOffered?.length || 0) - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" /> {courseCount} Courses
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/coaching/${coaching.coachingId}`}
                          className="p-2 text-gray-400 hover:text-[#0F52BA] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/coaching-dashboard/manage/${coaching.coachingId}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F52BA] text-white text-sm font-medium rounded-lg hover:bg-[#0A3D8F] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" /> Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Coachings Yet</h3>
              <p className="text-gray-500 text-sm mb-4">
                Create your first coaching institute to start reaching students.
              </p>
              <Button asChild className="bg-[#0F52BA] hover:bg-[#0A3D8F]">
                <Link href="/newCoaching">
                  <Plus className="w-4 h-4 mr-2" /> Create Coaching
                </Link>
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CoachDashboard;