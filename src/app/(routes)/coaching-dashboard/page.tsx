"use client";

import CoachingCard from '@/components/common/coaching-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardLoader, PageLoader } from '@/components/ui/loader';
import {
  Award,
  BookOpen,
  Building2,
  DollarSign,
  FileText,
  Plus,
  Settings,
  TrendingUp,
  Users
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
}

const CoachDashboard = () => {
  const { data: session, status } = useSession();
  const [coachings, setCoachings] = useState<CoachingData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCoachings: 0,
    totalProfiles: 0,
    totalCourses: 0,
    totalStudents: 0,
    pendingApprovals: 0,
    monthlyEarnings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  if (status === 'loading') {
    return <PageLoader text="Loading your dashboard..." />;
  }

  if (!session) {
    redirect('/login');
  }

  // Check if user has COACH role
  const userRoles = session.user?.roles || [session.user?.role];
  const hasCoachRole = userRoles.includes('COACH');
  
  if (!hasCoachRole) {
    const primaryRole = session.user?.role;
    if (primaryRole === 'STUDENT') {
      redirect('/dashboard');
    } else if (primaryRole === 'ADMIN') {
      redirect('/admin-dashboard');
    } else {
      redirect('/');
    }
  }

  useEffect(() => {
    fetchCoachings();
  }, []);

  const fetchCoachings = async () => {
    try {
      const response = await fetch('/api/coaching/my-coachings');
      if (response.ok) {
        const data = await response.json();
        setCoachings(data.coachings);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching coachings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, color = "blue" }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, href, buttonText, variant = "default" }: {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
    buttonText: string;
    variant?: "default" | "secondary" | "outline";
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-blue-100">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{description}</p>
            <Button variant={variant} size="sm" asChild>
              <Link href={href}>{buttonText}</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Coach Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {session.user?.name}! Manage your coaching institutes and courses.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Coachings"
            value={stats.totalCoachings}
            icon={Building2}
            description="Active coaching institutes"
            color="blue"
          />
          <StatCard
            title="Total Profiles"
            value={stats.totalProfiles}
            icon={Award}
            description="Branch profiles created"
            color="green"
          />
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            description="Courses offered"
            color="purple"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            description="Enrolled students"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Create New Coaching"
              description="Set up a new coaching institute and start reaching more students"
              icon={Plus}
              href="/newCoaching"
              buttonText="Create Coaching"
            />
            <QuickActionCard
              title="Manage Courses"
              description="Add new courses, update pricing, and manage course content"
              icon={BookOpen}
              href="/coaching-dashboard/courses"
              buttonText="Manage Courses"
              variant="outline"
            />
            <QuickActionCard
              title="View Students"
              description="Monitor student enrollments and track their progress"
              icon={Users}
              href="/coaching-dashboard/students"
              buttonText="View Students"
              variant="outline"
            />
            <QuickActionCard
              title="Manage Offers"
              description="Create discounts and special offers to attract more students"
              icon={DollarSign}
              href="/coaching-dashboard/offers"
              buttonText="Manage Offers"
              variant="outline"
            />
            <QuickActionCard
              title="Analytics"
              description="Track performance metrics and revenue insights"
              icon={TrendingUp}
              href="/coaching-dashboard/analytics"
              buttonText="View Analytics"
              variant="outline"
            />
            <QuickActionCard
              title="Settings"
              description="Update your profile settings and preferences"
              icon={Settings}
              href="/coaching-dashboard/settings"
              buttonText="Settings"
              variant="secondary"
            />
          </div>
        </div>

        {/* My Coachings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">My Coachings</h2>
            <Button asChild>
              <Link href="/newCoaching">
                <Plus className="h-4 w-4 mr-2" />
                Add New Coaching
              </Link>
            </Button>
          </div>          {isLoading ? (
            <CardLoader text="Loading your coaching institutes..." className="py-12" />
          ) : coachings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {coachings.map((coaching) => (
                <CoachingCard
                  key={coaching.id}
                  coaching={coaching}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Coachings Yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first coaching institute to start reaching students and managing courses.
                </p>
                <Button asChild>
                  <Link href="/newCoaching">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Coaching
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">New Student Enrollment</p>
                    <p className="text-sm text-gray-600">John Doe enrolled in JEE Main Course</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-gray-600">₹15,000 for NEET Course</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Course Updated</p>
                    <p className="text-sm text-gray-600">Mathematics syllabus updated for Class 12</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;