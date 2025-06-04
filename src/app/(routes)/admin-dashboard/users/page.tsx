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

const UsersPage = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (status === 'authenticated' && session?.user) {
        const userRoles = session.user?.roles || [session.user?.role];
        const hasAdminRole = userRoles.includes('ADMIN');
        
        if (hasAdminRole) {
          try {
            const response = await fetch('/api/admin/users-by-role');
            if (!response.ok) {
              throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data.users || []);
          } catch (err) {
            console.error('Error fetching users:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
          }
        }
      }
      setLoading(false);
    };

    fetchUsers();
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
      label: 'Name',
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
      key: 'primaryRole',
      label: 'Role',
      render: (value: string) => (
        <Badge variant={
          value === 'ADMIN' ? 'destructive' : 
          value === 'COACH' ? 'default' : 
          'secondary'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'age',
      label: 'Age',
      render: (value: number) => value || 'Not provided'
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const handleView = (user: User) => {
    // Navigate to user detail page
    window.location.href = `/admin-dashboard/users/${user.id}`;
  };

  const handleEdit = (user: User) => {
    // Navigate to user edit page
    console.log('Edit user:', user);
  };

  const handleDelete = (user: User) => {
    // Handle user deletion
    console.log('Delete user:', user);
  };

  return (
    <DetailPageTemplate
      title="All Users"
      data={users}
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

export default UsersPage;
