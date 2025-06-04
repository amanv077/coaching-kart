"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import ItemDetailView from '@/components/admin/ItemDetailView';

interface DetailField {
  label: string;
  key: string;
  render?: (value: any, item: any) => React.ReactNode;
  fullWidth?: boolean;
}

interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface UserDetail {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  age: number;
  classLevel?: string;
  schoolOrCollege?: string;
  lookingFor?: string;
  emailVerified: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  primaryRole: string;
  coachingCenters: any[];
  enrollments: any[];
  coachingCount: number;
  enrollmentCount: number;
}

const UserDetailPage = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === 'authenticated' && session?.user && userId) {
        const userRoles = session.user?.roles || [session.user?.role];
        const hasAdminRole = userRoles.includes('ADMIN');
        
        if (hasAdminRole) {
          try {
            const response = await fetch(`/api/admin/user/${userId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch user details');
            }
            const data = await response.json();
            setUser(data.user);
          } catch (err) {
            console.error('Error fetching user details:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [session, status, userId]);

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

  const sections: DetailSection[] = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', key: 'name' },
        { label: 'Email Address', key: 'email' },
        { label: 'Phone Number', key: 'phoneNumber' },
        { label: 'City', key: 'city' },
        { label: 'Age', key: 'age' },
        { label: 'User ID', key: 'userId' }
      ]
    },
    {
      title: 'Education & Preferences',
      fields: [
        { label: 'Class/Level', key: 'classLevel' },
        { label: 'School/College', key: 'schoolOrCollege' },
        { 
          label: 'Looking For', 
          key: 'lookingFor',
          render: (value: string) => value ? (
            <Badge variant="outline">{value}</Badge>
          ) : 'Not specified'
        }
      ]
    },
    {
      title: 'Account Details',
      fields: [        { 
          label: 'Roles', 
          key: 'roles',
          render: (value: string[]) => (
            <div className="flex gap-2 flex-wrap">
              {value.map((role, index) => (
                <Badge 
                  key={index} 
                  variant={
                    role === 'ADMIN' ? 'destructive' : 
                    role === 'COACH' ? 'default' : 
                    'secondary'
                  }
                >
                  {role}
                </Badge>
              ))}
            </div>
          )
        },
        { 
          label: 'Email Verified', 
          key: 'emailVerified',
          render: (value: string) => value ? (
            <Badge variant="default">Verified on {new Date(value).toLocaleDateString()}</Badge>
          ) : (
            <Badge variant="secondary">Not verified</Badge>
          )
        },
        { 
          label: 'Member Since', 
          key: 'createdAt',
          render: (value: string) => new Date(value).toLocaleDateString()
        },
        { 
          label: 'Last Updated', 
          key: 'updatedAt',
          render: (value: string) => new Date(value).toLocaleDateString()
        }
      ]
    },
    {
      title: 'Activity Summary',
      fields: [
        { 
          label: 'Coaching Centers Owned', 
          key: 'coachingCount',
          render: (value: number) => (
            <Badge variant="outline">
              {value} {value === 1 ? 'center' : 'centers'}
            </Badge>
          )
        },
        { 
          label: 'Course Enrollments', 
          key: 'enrollmentCount',
          render: (value: number) => (
            <Badge variant="secondary">
              {value} {value === 1 ? 'enrollment' : 'enrollments'}
            </Badge>
          )
        }
      ]
    }
  ];
  // Add coaching centers section if user is a coach
  if (user?.coachingCenters && user.coachingCenters.length > 0) {
    sections.push({
      title: 'Coaching Centers',
      fields: [
        {
          label: 'Owned Centers',
          key: 'coachingCenters',
          fullWidth: true,
          render: (centers: any[]) => (
            <div className="space-y-4">
              {centers.map((center, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{center.organizationName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {center.businessType} • 
                    <Badge className="ml-2" variant={center.approved ? 'default' : 'secondary'}>
                      {center.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </p>
                  <p className="text-sm mt-1">{center.coachingProfiles?.length || 0} profiles</p>
                </div>
              ))}
            </div>
          )
        }
      ]
    });
  }

  // Add enrollments section if user is a student
  if (user?.enrollments && user.enrollments.length > 0) {
    sections.push({
      title: 'Course Enrollments',
      fields: [
        {
          label: 'Enrolled Courses',
          key: 'enrollments',
          fullWidth: true,
          render: (enrollments: any[]) => (
            <div className="space-y-4">
              {enrollments.map((enrollment, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{enrollment.course.courseName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {enrollment.course.coaching?.organizationName}
                  </p>
                  <p className="text-sm mt-1">₹{enrollment.course.courseAmount}</p>
                </div>
              ))}
            </div>
          )
        }
      ]
    });
  }

  const handleEdit = (user: UserDetail) => {
    console.log('Edit user:', user);
    // TODO: Implement user editing
  };

  const handleDelete = (user: UserDetail) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Delete user:', user);
      // TODO: Implement user deletion
    }
  };

  return (
    <ItemDetailView
      title={user?.name || 'User Details'}
      item={user}
      sections={sections}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      backHref="/admin-dashboard/users"
      backLabel="Back to Users"
    />
  );
};

export default UserDetailPage;
