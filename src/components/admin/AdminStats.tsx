"use client";

import React from 'react';
import ClickableStatCard from './ClickableStatCard';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  TrendingUp, 
  AlertCircle,
  DollarSign,
  Shield
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
      description: 'All registered users',
      href: '/admin-dashboard/users',
      singular: 'user',
      plural: 'users'
    },
    {
      title: 'Active Coaches',
      value: stats.totalCoaches,
      icon: GraduationCap,
      color: 'bg-green-500',
      description: 'Verified coaches',
      href: '/admin-dashboard/coaches',
      singular: 'coach',
      plural: 'coaches'
    },
    {
      title: 'Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Active students',
      href: '/admin-dashboard/students',
      singular: 'student',
      plural: 'students'
    },
    {
      title: 'Admins',
      value: stats.totalAdmins,
      icon: Shield,
      color: 'bg-indigo-500',
      description: 'Platform administrators',
      href: '/admin-dashboard/admins',
      singular: 'admin',
      plural: 'admins'
    },
    {
      title: 'Coaching Institutes',
      value: stats.totalCoachings,
      icon: Building2,
      color: 'bg-orange-500',
      description: 'Total institutes',
      href: '/admin-dashboard/coaching-institutes',
      singular: 'institute',
      plural: 'institutes'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: AlertCircle,
      color: 'bg-red-500',
      description: 'Awaiting review',
      href: '/admin-dashboard/pending-approvals',
      singular: 'approval',
      plural: 'approvals'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <ClickableStatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          description={stat.description}
          href={stat.href}
          singular={stat.singular}
          plural={stat.plural}
        />
      ))}
    </div>
  );
};

export default AdminStats;
