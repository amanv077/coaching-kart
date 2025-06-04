'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building, Calendar, MapPin, Phone, Mail, User, BookOpen, Award, Clock, Users, Star } from 'lucide-react';
import ItemDetailView from '@/components/admin/ItemDetailView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CoachingInstitute {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  establishedYear?: number;
  registrationNumber?: string;
  logo?: string;
  facilities?: string;
  accreditation?: string;
  achievements?: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  courses: Array<{
    id: string;
    title: string;
    category: string;
    duration: string;
    price: number;
    isActive: boolean;
    _count: {
      enrollments: number;
    };
  }>;
  _count: {
    courses: number;
    enrollments: number;
    coaches: number;
  };
}

export default function CoachingInstituteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [institute, setInstitute] = useState<CoachingInstitute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        const response = await fetch(`/api/admin/coaching-institute/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coaching institute details');
        }
        const data = await response.json();
        setInstitute(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInstitute();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin-dashboard/coaching-institutes/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this coaching institute?')) {
      try {
        const response = await fetch(`/api/admin/coaching-institute/${params.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete coaching institute');
        }
        router.push('/admin-dashboard/coaching-institutes');
      } catch (err) {
        alert('Failed to delete coaching institute');
      }
    }
  };
  const sections = [
    {
      title: 'Basic Information',
      fields: [
        { label: 'Organization Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Website', key: 'website', render: (value: string) => value || 'Not provided' },
        { label: 'Registration Number', key: 'registrationNumber', render: (value: string) => value || 'Not provided' },
        { 
          label: 'Approval Status', 
          key: 'approvalStatus',
          render: (status: string) => (
            <Badge variant={status === 'APPROVED' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          )
        },
      ]
    },
    {
      title: 'Location Details',
      fields: [
        { label: 'Address', key: 'address' },
        { label: 'Established Year', key: 'establishedYear', render: (value: number) => value?.toString() || 'Not provided' },
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        { label: 'Description', key: 'description' },
        { label: 'Facilities', key: 'facilities', render: (value: string) => value || 'Not provided' },
        { label: 'Accreditation', key: 'accreditation', render: (value: string) => value || 'Not provided' },
        { label: 'Achievements', key: 'achievements', render: (value: string) => value || 'Not provided' },
      ]
    },
    {
      title: 'Owner Information',
      fields: [
        {
          label: 'Owner Details',
          key: 'owner',
          fullWidth: true,
          render: (owner: any) => owner ? (
            <div className="space-y-2">
              <div className="font-medium">{owner.name}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {owner.email}
                </div>
                {owner.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {owner.phone}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No owner information available</p>
          )
        }
      ]
    },
    {
      title: 'Courses & Programs',
      fields: [
        {
          label: 'Available Courses',
          key: 'courses',
          fullWidth: true,
          render: (courses: any[]) => (
            <div className="space-y-4">
              {courses && courses.length > 0 ? (
                courses.map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{course.title}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          ₹{course.price?.toLocaleString() || 'N/A'}
                        </Badge>
                        <Badge variant={course.isActive ? 'default' : 'secondary'}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="h-3 w-3" />
                        Category: {course.category}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Duration: {course.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        Enrollments: {course._count?.enrollments || 0}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No courses found</p>
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
        { label: 'Institute ID', key: 'id' },
      ]
    }
  ];

  return (
    <ItemDetailView
      title={`Institute: ${institute?.name || 'Loading...'}`}
      item={institute}
      sections={sections}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      backHref="/admin-dashboard/coaching-institutes"
      backLabel="Back to Coaching Institutes"
    />
  );
}
