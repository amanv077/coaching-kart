"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import DetailPageTemplate from '@/components/admin/DetailPageTemplate';

interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  age: number;
  classLevel?: string;
  schoolOrCollege?: string;
  roles: string[];
  primaryRole: string;
  createdAt: string;
  coachingCount: number;
  enrollmentCount: number;
}

const CoachesPage = () => {
  const { data: session, status } = useSession();
  const [coaches, setCoaches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      if (status === 'authenticated' && session?.user) {
        const userRoles = session.user?.roles || [session.user?.role];
        const hasAdminRole = userRoles.includes('ADMIN');
        
        if (hasAdminRole) {
          try {
            const response = await fetch('/api/admin/users-by-role?role=COACH');
            if (!response.ok) {
              throw new Error('Failed to fetch coaches');
            }
            const data = await response.json();
            setCoaches(data.users || []);
          } catch (err) {
            console.error('Error fetching coaches:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
          }
        }
      }
      setLoading(false);
    };

    fetchCoaches();
  }, [session, status]);

  // Authentication and authorization checks
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    redirect('/login');
  }

  const userRoles = session.user?.roles || [session.user?.role];
  const hasAdminRole = userRoles.includes('ADMIN');
  
  if (!hasAdminRole) {
    redirect('/admin-dashboard');
  }

  const columns = [
    {
      key: 'name',
      label: 'Coach Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      render: (value: string) => value || 'Not provided'
    },
    {
      key: 'city',
      label: 'City',
      render: (value: string) => value || 'Not provided'
    },
    {
      key: 'schoolOrCollege',
      label: 'Institution',
      render: (value: string) => value || 'Not provided'
    },
    {
      key: 'age',
      label: 'Age',
      render: (value: number) => value || 'Not provided'
    },
    {
      key: 'coachingCount',
      label: 'Coaching Centers',
      render: (value: number) => (
        <Badge variant="outline">
          {value} {value === 1 ? 'center' : 'centers'}
        </Badge>
      )
    },
    {
      key: 'enrollmentCount',
      label: 'Students Taught',
      render: (value: number) => (
        <Badge variant="secondary">
          {value} {value === 1 ? 'student' : 'students'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const handleView = (coach: User) => {
    window.location.href = `/admin-dashboard/coaches/${coach.id}`;
  };

  const handleEdit = (coach: User) => {
    console.log('Edit coach:', coach);
  };

  const handleDelete = (coach: User) => {
    console.log('Delete coach:', coach);
  };

  return (
    <DetailPageTemplate
      title="Coaches"
      data={coaches}
      columns={columns}
      loading={loading}
      error={error}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      searchable={true}
      backHref="/admin-dashboard"
    />
  );
};

export default CoachesPage;
