"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Users, BookOpen, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface DemoSlotFormProps {
  profileId: string;
  profileName: string;
}

interface Course {
  id: string;
  courseName: string;
}

const DemoSlotForm: React.FC<DemoSlotFormProps> = ({ profileId, profileName }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    instructor: '',
    demoAddress: '',
    landmark: '',
    demoDays: 1,
    maxParticipants: 5,
    isFree: true,
    price: 0,
    classLevels: [''], // New field for class levels (Commerce, 12th, NEET, IIT, etc.)
    availableDates: [''],
    timeSlots: [''],
    subjects: [''],
  });

  useEffect(() => {
    fetchCourses();
  }, [profileId]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/coaching/profile/${profileId}/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const addField = (fieldName: 'availableDates' | 'timeSlots' | 'subjects' | 'classLevels') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeField = (fieldName: 'availableDates' | 'timeSlots' | 'subjects' | 'classLevels', index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const updateField = (fieldName: 'availableDates' | 'timeSlots' | 'subjects' | 'classLevels', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseId || !formData.title || !formData.instructor || !formData.demoAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    const filteredData = {
      ...formData,
      classLevels: formData.classLevels.filter(level => level.trim() !== ''),
      availableDates: formData.availableDates.filter(date => date.trim() !== ''),
      timeSlots: formData.timeSlots.filter(slot => slot.trim() !== ''),
      subjects: formData.subjects.filter(subject => subject.trim() !== ''),
    };

    if (filteredData.classLevels.length === 0 || filteredData.availableDates.length === 0 || filteredData.timeSlots.length === 0 || filteredData.subjects.length === 0) {
      toast.error('Please provide at least one class level, date, time slot, and subject');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/demo-sessions/${profileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
      });

      if (response.ok) {
        toast.success('Demo session created successfully!');
        router.push(`/coaching-dashboard/demo-management`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create demo session');
      }
    } catch (error) {
      console.error('Error creating demo session:', error);
      toast.error('Failed to create demo session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6" />
          Create Demo Session - {profileName}
        </CardTitle>
        <CardDescription>
          Set up an offline demo session for students to book and attend at your coaching center
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseId">Course *</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Demo Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Math Foundation Demo"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what will be covered in the demo"
            />
          </div>

          {/* Class Levels */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Class Levels
            </h3>
            
            {formData.classLevels.map((level, index) => (
              <div key={index} className="flex gap-2">
                <Select
                  value={level}
                  onValueChange={(value) => updateField('classLevels', index, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select class level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commerce">Commerce</SelectItem>
                    <SelectItem value="Class 12">Class 12</SelectItem>
                    <SelectItem value="Class 11">Class 11</SelectItem>
                    <SelectItem value="Class 10">Class 10</SelectItem>
                    <SelectItem value="NEET">NEET</SelectItem>
                    <SelectItem value="IIT-JEE">IIT-JEE</SelectItem>
                    <SelectItem value="UPSC">UPSC</SelectItem>
                    <SelectItem value="Banking">Banking</SelectItem>
                    <SelectItem value="SSC">SSC</SelectItem>
                    <SelectItem value="Gate">Gate</SelectItem>
                  </SelectContent>
                </Select>
                {formData.classLevels.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeField('classLevels', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addField('classLevels')}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Class Level
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor">Instructor Name *</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                placeholder="Name of the instructor"
              />
            </div>

            <div>
              <Label htmlFor="demoDays">Demo Duration (Days)</Label>
              <Select value={formData.demoDays.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, demoDays: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day} day{day > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Demo Location
            </h3>
            
            <div>
              <Label htmlFor="demoAddress">Demo Address *</Label>
              <Textarea
                id="demoAddress"
                value={formData.demoAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, demoAddress: e.target.value }))}
                placeholder="Complete address where demo will be conducted"
              />
            </div>

            <div>
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                value={formData.landmark}
                onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                placeholder="Nearby landmark for easy location"
              />
            </div>
          </div>

          {/* Available Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Available Dates
            </h3>
            
            {formData.availableDates.map((date, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => updateField('availableDates', index, e.target.value)}
                  className="flex-1"
                />
                {formData.availableDates.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeField('availableDates', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addField('availableDates')}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Date
            </Button>
          </div>

          {/* Time Slots */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Slots
            </h3>
            
            {formData.timeSlots.map((slot, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={slot}
                  onChange={(e) => updateField('timeSlots', index, e.target.value)}
                  placeholder="e.g., 10:00-11:00 or 14:00-16:00"
                  className="flex-1"
                />
                {formData.timeSlots.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeField('timeSlots', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addField('timeSlots')}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subjects/Topics
            </h3>
            
            {formData.subjects.map((subject, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={subject}
                  onChange={(e) => updateField('subjects', index, e.target.value)}
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  className="flex-1"
                />
                {formData.subjects.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeField('subjects', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addField('subjects')}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                max="50"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFree"
                checked={formData.isFree}
                onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked }))}
                className="h-4 w-4"
              />
              <Label htmlFor="isFree">Free Demo Session</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Demo Session'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DemoSlotForm;
