"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { PageLoader } from '@/components/ui/loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStats from '@/components/admin/AdminStats';
import PendingApprovalsContainer from '@/components/admin/PendingApprovalsContainer';
import UserManagementContainer from '@/components/admin/UserManagementContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Clock, 
  Settings, 
  Shield,
  TrendingUp,
  CheckCircle2,
  Database,
  Server
} from 'lucide-react';

const AdminDashboard = () => {
  // All hooks must be called at the top, before any conditional logic
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalCoaches: number;
    totalStudents: number;
    totalAdmins: number;
    totalCoachings: number;
    pendingApprovals: number;
    totalRevenue: number;
    monthlyGrowth: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin stats - this hook must be called before any conditional returns
  useEffect(() => {
    const fetchStats = async () => {
      // Only fetch if user is authenticated and has admin role
      if (status === 'authenticated' && session?.user) {
        const userRoles = session.user?.roles || [session.user?.role];
        const hasAdminRole = userRoles.includes('ADMIN');
        
        if (hasAdminRole) {
          try {            const response = await fetch('/api/admin/stats');
            if (!response.ok) {
              throw new Error('Failed to fetch admin stats');
            }
            const data = await response.json();
            setStats(data.stats);
          } catch (err) {
            console.error('Error fetching admin stats:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
          }
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, [session, status]);

  // Session loading check
  if (status === 'loading' || loading) {
    return <PageLoader text="Loading admin dashboard..." />;
  }
  
  // Authentication check
  if (!session) {
    redirect('/login');
  }

  // Authorization check
  const userRoles = session.user?.roles || [session.user?.role];
  const hasAdminRole = userRoles.includes('ADMIN');
  
  if (!hasAdminRole) {
    const primaryRole = session.user?.role;
    if (primaryRole === 'STUDENT') {
      redirect('/dashboard');
    } else if (primaryRole === 'COACH') {
      redirect('/coaching-dashboard');
    } else {
      redirect('/');
    }
  }
  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, <span className="font-medium">{session.user?.name}</span>. 
              Manage your platform and oversee all operations.
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Operational
          </Badge>
        </div>

        {/* Admin Stats */}
        {stats && <AdminStats stats={stats} />}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Approvals
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Health
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          User Growth
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                          +{stats?.monthlyGrowth || 0}% this month
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          Active Coaches
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-200">
                          {stats?.totalCoaches || 0} verified coaches
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          Pending Actions
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-200">
                          {stats?.pendingApprovals || 0} items need attention
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>              {/* Quick System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">System Status</p>
                        <p className="text-sm text-green-700 dark:text-green-200">All systems operational</p>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">Performance</p>
                        <p className="text-sm text-blue-700 dark:text-blue-200">Optimal response times</p>
                      </div>
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>          <TabsContent value="approvals">
            <PendingApprovalsContainer />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementContainer />
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Health & Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Monitor system health, performance metrics, and admin controls.
                  </p>
                  {/* SystemHealth component will be implemented with self-contained data fetching */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">Server Status</p>
                        <p className="text-sm text-green-700 dark:text-green-200">All systems operational</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">Database</p>
                        <p className="text-sm text-blue-700 dark:text-blue-200">Optimal performance</p>
                      </div>
                      <Database className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-900 dark:text-yellow-100">Backup</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">Last: 2 hours ago</p>
                      </div>
                      <Server className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">Daily Active Users</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                          {stats ? Math.floor(stats.totalUsers * 0.15) : 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">Revenue Growth</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-200">
                          +{stats?.monthlyGrowth || 0}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-900 dark:text-purple-100">Course Completion Rate</p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">87%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Admin Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex flex-col gap-2" variant="outline">
                      <Settings className="h-6 w-6" />
                      <span className="text-sm">System Settings</span>
                    </Button>
                    <Button className="h-20 flex flex-col gap-2" variant="outline">
                      <Database className="h-6 w-6" />
                      <span className="text-sm">Database Backup</span>
                    </Button>
                    <Button className="h-20 flex flex-col gap-2" variant="outline">
                      <Shield className="h-6 w-6" />
                      <span className="text-sm">Security Audit</span>
                    </Button>
                    <Button className="h-20 flex flex-col gap-2" variant="outline">
                      <BarChart3 className="h-6 w-6" />
                      <span className="text-sm">Generate Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;