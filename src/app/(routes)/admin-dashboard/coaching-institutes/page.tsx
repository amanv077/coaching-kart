"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import DetailPageTemplate from '@/components/admin/DetailPageTemplate';

interface CoachingInstitute {
  id: string;
  coachingId: string;
  organizationName: string;
  ownerName: string;
  ownerEmail: string;
  businessType: string;
  approved: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
  };
  courseCount: number;
  profileCount: number;
  enrollmentCount: number;
}

const CoachingInstitutesPage = () => {
  const { data: session, status } = useSession();
  const [institutes, setInstitutes] = useState<CoachingInstitute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitutes = async () => {
      if (status === 'authenticated' && session?.user) {
        const userRoles = session.user?.roles || [session.user?.role];
        const hasAdminRole = userRoles.includes('ADMIN');
        
        if (hasAdminRole) {
          try {
            const response = await fetch('/api/admin/coaching-institutes');
            if (!response.ok) {
              throw new Error('Failed to fetch coaching institutes');
            }
            const data = await response.json();
            setInstitutes(data.coachings || []);
          } catch (err) {
            console.error('Error fetching coaching institutes:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
          }
        }
      }
      setLoading(false);
    };

    fetchInstitutes();
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
      key: 'organizationName',
      label: 'Institute Name',
    },
    {
      key: 'ownerName',
      label: 'Owner',
    },
    {
      key: 'ownerEmail',
      label: 'Owner Email',
    },
    {
      key: 'businessType',
      label: 'Business Type',
      render: (value: string) => value || 'Not specified'
    },
    {
      key: 'approved',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Approved' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'profileCount',
      label: 'Profiles',
      render: (value: number) => (
        <Badge variant="outline">
          {value} {value === 1 ? 'profile' : 'profiles'}
        </Badge>
      )
    },
    {
      key: 'courseCount',
      label: 'Courses',
      render: (value: number) => (
        <Badge variant="outline">
          {value} {value === 1 ? 'course' : 'courses'}
        </Badge>
      )
    },
    {
      key: 'enrollmentCount',
      label: 'Students',
      render: (value: number) => (
        <Badge variant="secondary">
          {value} {value === 1 ? 'student' : 'students'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const handleView = (institute: CoachingInstitute) => {
    window.location.href = `/admin-dashboard/coaching-institutes/${institute.id}`;
  };

  const handleEdit = (institute: CoachingInstitute) => {
    console.log('Edit institute:', institute);
  };

  const handleDelete = (institute: CoachingInstitute) => {
    console.log('Delete institute:', institute);
  };

  return (
    <DetailPageTemplate
      title="Coaching Institutes"
      data={institutes}
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

export default CoachingInstitutesPage;
