'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, GraduationCap, Calendar, MapPin, Phone, Mail, User, BookOpen, Award, Clock } from 'lucide-react';
import ItemDetailView from '@/components/admin/ItemDetailView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  emergencyContact?: string;
  academicHistory?: string;
  interests?: string;
  goals?: string;
  createdAt: string;
  updatedAt: string;
  enrollments: Array<{
    id: string;
    status: string;
    enrolledAt: string;
    course: {
      id: string;
      title: string;
      category: string;
      duration: string;
    };
    coachingInstitute: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    enrollments: number;
  };
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/admin/user/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        if (data.role !== 'STUDENT') {
          throw new Error('User is not a student');
        }
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin-dashboard/students/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`/api/admin/user/${params.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete student');
        }
        router.push('/admin-dashboard/students');
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Loading Student Details...</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Student Not Found</h1>
        </div>
        <p className="text-gray-600">{error || 'Student details could not be loaded.'}</p>
      </div>
    );
  }  const sections = [
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
      title: 'Academic Information',
      fields: [
        { label: 'Academic History', key: 'academicHistory', render: (value: string) => value || 'Not provided' },
        { label: 'Interests', key: 'interests', render: (value: string) => value || 'Not specified' },
        { label: 'Goals', key: 'goals', render: (value: string) => value || 'Not specified' },
        { label: 'Total Enrollments', key: '_count', render: (value: any) => value?.enrollments?.toString() || '0' },
      ]
    },
    {
      title: 'Current Enrollments',
      fields: [
        {
          label: 'Enrolled Courses',
          key: 'enrollments',
          fullWidth: true,
          render: (enrollments: any[]) => (
            <div className="space-y-4">
              {enrollments.length === 0 ? (
                <p className="text-gray-500">No enrollments found</p>
              ) : (
                enrollments.map((enrollment, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{enrollment.course.title}</span>
                      <Badge variant={enrollment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {enrollment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {enrollment.coachingInstitute.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-3 w-3" />
                        {enrollment.course.category}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Duration: {enrollment.course.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
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
        { label: 'Student ID', key: 'id' },
      ]
    }
  ];

  return (
    <ItemDetailView
      title={`Student: ${student?.name || 'Loading...'}`}
      item={student}
      sections={sections}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      backHref="/admin-dashboard/students"
      backLabel="Back to Students"
    />
  );
}
