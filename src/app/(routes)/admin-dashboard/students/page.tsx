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
  enrollmentCount: number;
}

const StudentsPage = () => {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (status === 'authenticated' && session?.user) {
        const userRoles = session.user?.roles || [session.user?.role];
        const hasAdminRole = userRoles.includes('ADMIN');
        
        if (hasAdminRole) {
          try {
            const response = await fetch('/api/admin/users-by-role?role=STUDENT');
            if (!response.ok) {
              throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setStudents(data.users || []);
          } catch (err) {
            console.error('Error fetching students:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
          }
        }
      }
      setLoading(false);
    };

    fetchStudents();
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
      label: 'Student Name',
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
      key: 'classLevel',
      label: 'Class/Level',
      render: (value: string) => value || 'Not specified'
    },
    {
      key: 'schoolOrCollege',
      label: 'School/College',
      render: (value: string) => value || 'Not provided'
    },
    {
      key: 'age',
      label: 'Age',
      render: (value: number) => value || 'Not provided'
    },
    {
      key: 'enrollmentCount',
      label: 'Enrollments',
      render: (value: number) => (
        <Badge variant="outline">
          {value} {value === 1 ? 'course' : 'courses'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const handleView = (student: User) => {
    window.location.href = `/admin-dashboard/students/${student.id}`;
  };

  const handleEdit = (student: User) => {
    console.log('Edit student:', student);
  };

  const handleDelete = (student: User) => {
    console.log('Delete student:', student);
  };

  return (
    <DetailPageTemplate
      title="Students"
      data={students}
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

export default StudentsPage;
