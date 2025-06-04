'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Calendar, Phone, Mail, User, Settings, Lock, Activity } from 'lucide-react';
import ItemDetailView from '@/components/admin/ItemDetailView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Admin {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  emergencyContact?: string;
  adminLevel?: string;
  permissions?: string;
  department?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    managedUsers?: number;
    auditLogs?: number;
  };
}

export default function AdminDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(`/api/admin/user/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch admin details');
        }
        const data = await response.json();
        if (data.role !== 'ADMIN') {
          throw new Error('User is not an admin');
        }
        setAdmin(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAdmin();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin-dashboard/admins/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this admin?')) {
      try {
        const response = await fetch(`/api/admin/user/${params.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete admin');
        }
        router.push('/admin-dashboard/admins');
      } catch (err) {
        alert('Failed to delete admin');
      }
    }
  };

  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone', render: (value: string) => value || 'Not provided' },
        { label: 'Address', key: 'address', render: (value: string) => value || 'Not provided' },
        { label: 'Date of Birth', key: 'dateOfBirth', render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Not provided' },
        { label: 'Gender', key: 'gender', render: (value: string) => value || 'Not specified' },
        { label: 'Emergency Contact', key: 'emergencyContact', render: (value: string) => value || 'Not provided' },
      ]
    },
    {
      title: 'Administrative Information',
      fields: [
        { label: 'Admin Level', key: 'adminLevel', render: (value: string) => value || 'Not specified' },
        { label: 'Department', key: 'department', render: (value: string) => value || 'Not specified' },
        { 
          label: 'Permissions', 
          key: 'permissions',
          render: (permissions: string[]) => permissions && permissions.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {permissions.map((permission, index) => (
                <Badge key={index} variant="outline">
                  {permission}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">No specific permissions assigned</span>
          )
        },
        { label: 'Bio', key: 'bio', render: (value: string) => value || 'Not provided' },
      ]
    },
    {
      title: 'System Activity',
      fields: [
        { label: 'Last Login', key: 'lastLogin', render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Never logged in' },
        { label: 'Total Logins', key: 'loginCount', render: (value: number) => value?.toString() || '0' },
        { 
          label: 'Status', 
          key: 'isActive',
          render: (isActive: boolean) => (
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          )
        },
      ]
    },
    {
      title: 'Account Details',
      fields: [
        { label: 'Account Created', key: 'createdAt', render: (value: string) => new Date(value).toLocaleDateString() },
        { label: 'Last Updated', key: 'updatedAt', render: (value: string) => new Date(value).toLocaleDateString() },
        { label: 'Admin ID', key: 'id' },
      ]
    }
  ];

  return (
    <ItemDetailView
      title={`Admin: ${admin?.name || 'Loading...'}`}
      item={admin}
      sections={sections}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      backHref="/admin-dashboard/admins"
      backLabel="Back to Admins"
    />
  );
}
