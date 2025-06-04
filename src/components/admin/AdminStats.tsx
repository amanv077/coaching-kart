"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  TrendingUp, 
  AlertCircle,
  DollarSign 
} from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalCoaches: number;
    totalStudents: number;
    totalAdmins: number;
    totalCoachings: number;
    pendingApprovals: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      description: 'All registered users'
    },
    {
      title: 'Active Coaches',
      value: stats.totalCoaches,
      icon: GraduationCap,
      color: 'bg-green-500',
      description: 'Verified coaches'
    },
    {
      title: 'Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Active students'
    },
    {
      title: 'Coaching Institutes',
      value: stats.totalCoachings,
      icon: Building2,
      color: 'bg-orange-500',
      description: 'Total institutes'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: AlertCircle,
      color: 'bg-red-500',
      description: 'Awaiting review'
    },
    {
      title: 'Platform Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      description: 'This month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
