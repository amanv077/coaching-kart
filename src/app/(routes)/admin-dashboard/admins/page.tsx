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
  roles: string[];
  primaryRole: string;
  createdAt: string;
}

const AdminsPage = () => {
  const { data: session, status } = useSession();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      if (status === 'authenticated' && session?.user) {
        const userRoles = session.user?.roles || [session.user?.role];
        const hasAdminRole = userRoles.includes('ADMIN');
        
        if (hasAdminRole) {
          try {
            const response = await fetch('/api/admin/users-by-role?role=ADMIN');
            if (!response.ok) {
              throw new Error('Failed to fetch admins');
            }
            const data = await response.json();
            setAdmins(data.users || []);
          } catch (err) {
            console.error('Error fetching admins:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
          }
        }
      }
      setLoading(false);
    };

    fetchAdmins();
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
      label: 'Admin Name',
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
      key: 'age',
      label: 'Age',
      render: (value: number) => value || 'Not provided'
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (value: string[]) => (
        <div className="flex gap-1 flex-wrap">
          {value.map((role, index) => (
            <Badge key={index} variant="destructive" className="text-xs">
              {role}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const handleView = (admin: User) => {
    window.location.href = `/admin-dashboard/admins/${admin.id}`;
  };

  const handleEdit = (admin: User) => {
    console.log('Edit admin:', admin);
  };

  const handleDelete = (admin: User) => {
    // Prevent deleting the current admin
    if (admin.id === session?.user?.id) {
      alert('You cannot delete your own admin account');
      return;
    }
    console.log('Delete admin:', admin);
  };

  return (
    <DetailPageTemplate
      title="Platform Administrators"
      data={admins}
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

export default AdminsPage;
