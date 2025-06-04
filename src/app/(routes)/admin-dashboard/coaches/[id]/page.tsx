'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, UserCheck, Calendar, MapPin, Phone, Mail, User, BookOpen, Award, Building } from 'lucide-react';
import ItemDetailView from '@/components/admin/ItemDetailView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Coach {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  emergencyContact?: string;
  experience?: string;
  qualifications?: string;
  specialization?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  coachingInstitute?: {
    id: string;
    name: string;
    address: string;
    phone: string;
  };
  courses: Array<{
    id: string;
    title: string;
    category: string;
    duration: string;
    price: number;
    isActive: boolean;
  }>;
  _count: {
    courses: number;
    enrollments: number;
  };
}

export default function CoachDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const response = await fetch(`/api/admin/user/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coach details');
        }
        const data = await response.json();
        if (data.role !== 'COACH') {
          throw new Error('User is not a coach');
        }
        setCoach(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCoach();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin-dashboard/coaches/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this coach?')) {
      try {
        const response = await fetch(`/api/admin/user/${params.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete coach');
        }
        router.push('/admin-dashboard/coaches');
      } catch (err) {
        alert('Failed to delete coach');
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
      title: 'Professional Information',
      fields: [
        { label: 'Experience', key: 'experience', render: (value: string) => value || 'Not provided' },
        { label: 'Qualifications', key: 'qualifications', render: (value: string) => value || 'Not provided' },
        { label: 'Specialization', key: 'specialization', render: (value: string) => value || 'Not specified' },
        { label: 'Bio', key: 'bio', render: (value: string) => value || 'Not provided' },
        { label: 'Total Courses', key: '_count', render: (value: any) => value?.courses?.toString() || '0' },
        { label: 'Total Students', key: '_count', render: (value: any) => value?.enrollments?.toString() || '0' },
      ]
    },
    {
      title: 'Coaching Institute',
      fields: [
        {
          label: 'Institute Details',
          key: 'coachingInstitute',
          fullWidth: true,
          render: (institute: any) => institute ? (
            <div className="space-y-2">
              <div className="font-medium">{institute.name}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  {institute.address}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {institute.phone}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Not affiliated with any coaching institute</p>
          )
        }
      ]
    },
    {
      title: 'Courses Offered',
      fields: [
        {
          label: 'Course List',
          key: 'courses',
          fullWidth: true,
          render: (courses: any[]) => (
            <div className="space-y-4">
              {courses.length === 0 ? (
                <p className="text-gray-500">No courses offered</p>
              ) : (
                courses.map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{course.title}</span>
                      <Badge variant={course.isActive ? 'default' : 'secondary'}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="h-3 w-3" />
                        {course.category}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Duration: {course.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 text-green-600">₹</span>
                        Price: ₹{course.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )
        }
      ]
    },
    {
      title: 'Account Details',
      fields: [
        { label: 'Account Created', key: 'createdAt', render: (value: string) => new Date(value).toLocaleDateString() },
        { label: 'Last Updated', key: 'updatedAt', render: (value: string) => new Date(value).toLocaleDateString() },
        { label: 'Coach ID', key: 'id' },
      ]
    }
  ];

  return (
    <ItemDetailView
      title={`Coach: ${coach?.name || 'Loading...'}`}
      item={coach}
      sections={sections}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      backHref="/admin-dashboard/coaches"
      backLabel="Back to Coaches"
    />
  );
}
