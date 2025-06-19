"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PageLoader } from '@/components/ui/loader';
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Star,
  Users,
  BookOpen,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CoachingData {
  id: string;
  coachingId: string;
  organizationName: string;
  businessType: 'Individual' | 'Partnership' | 'Company' | 'Trust';
  gstNumber?: string;
  panNumber?: string;
  approved: boolean;
  isActive: boolean;
  ownerUserId: string;
  profiles: Array<{
    id: string;
    profileId: string;
    name: string;
    branchName?: string;
    establishedYear: number;
    tagline?: string;
    description: string;
    logo?: string;
    images: string[];
    
    // Location details
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    
    // Contact details
    contactNumber: string;
    alternateNumber?: string;
    email: string;
    website?: string;
    
    // Social media
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    twitterUrl?: string;
    
    // Operating details
    operatingDays: string[];
    operatingHours: string;
    facilities: string[];
    
    // Academic details
    subjectsOffered: string[];
    examsOffered: string[];
    
    // Status
    approved: boolean;
    isActive: boolean;
    verificationStatus: 'Pending' | 'Verified' | 'Rejected';
    rating?: number;
    totalRatings?: number;
    
    courses: Array<{
      id: string;
      courseName: string;
      courseAmount: number;
      courseDescription?: string;
      courseDuration?: string;
    }>;    teachers: Array<{
      id: string;
      name: string;
      qualification: string;
      experience: number;
      profileImage?: string;
      bio?: string;
      specialization: string[];
    }>;
  }>;
}

const ManageCoachingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [coaching, setCoaching] = useState<CoachingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const coachingId = params.id as string;

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/login');
      return;
    }

    fetchCoachingData();
  }, [status, session, coachingId]);

  const fetchCoachingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coaching/${coachingId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Coaching not found');
          router.push('/coaching-dashboard');
          return;
        }
        throw new Error('Failed to fetch coaching data');
      }

      const data = await response.json();
      
      // Check if user owns this coaching
      if (data.ownerUserId !== session?.user?.id) {
        toast.error('You do not have permission to manage this coaching');
        router.push('/coaching-dashboard');
        return;
      }

      setCoaching(data);
    } catch (error) {
      console.error('Error fetching coaching:', error);
      toast.error('Failed to load coaching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!coaching) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/coaching/${coachingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coaching),
      });

      if (!response.ok) {
        throw new Error('Failed to update coaching');
      }

      toast.success('Coaching updated successfully');
      setEditMode(false);
      await fetchCoachingData();
    } catch (error) {
      console.error('Error updating coaching:', error);
      toast.error('Failed to update coaching');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!coaching) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete "${coaching.organizationName}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/coaching/${coachingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete coaching');
      }

      toast.success('Coaching deleted successfully');
      router.push('/coaching-dashboard');
    } catch (error) {
      console.error('Error deleting coaching:', error);
      toast.error('Failed to delete coaching');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!coaching) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Coaching Not Found</h1>
            <Button asChild>
              <Link href="/coaching-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const mainProfile = coaching.profiles[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/coaching-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Manage {coaching.organizationName}
              </h1>
              <p className="text-muted-foreground">
                View and edit your coaching information
              </p>
            </div>
          </div>
            <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/coaching/${coachingId}`}>
                <Eye className="h-4 w-4 mr-2" />
                Public View
              </Link>
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              disabled={deleting || saving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
            
            {editMode ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setEditMode(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  coaching.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold">
                    {coaching.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  coaching.approved ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approval</p>
                  <p className="font-semibold">
                    {coaching.approved ? 'Approved' : 'Pending'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profiles</p>
                  <p className="font-semibold">{coaching.profiles.length} Branch{coaching.profiles.length > 1 ? 'es' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Coaching Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="organization">Organization</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
              </TabsList>              <TabsContent value="overview" className="space-y-6">
                {/* Organization Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quick Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orgName">Organization Name</Label>
                      {editMode ? (
                        <Input
                          id="orgName"
                          value={coaching.organizationName}
                          onChange={(e) => setCoaching({
                            ...coaching,
                            organizationName: e.target.value
                          })}
                        />
                      ) : (
                        <p className="p-3 bg-muted rounded-md">{coaching.organizationName}</p>
                      )}
                    </div>
                      <div>
                      <Label>Status Controls</Label>
                      {editMode ? (
                        <div className="flex items-center gap-4 p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={coaching.isActive}
                              onCheckedChange={(checked: boolean) => setCoaching({
                                ...coaching,
                                isActive: checked
                              })}
                              className="data-[state=checked]:bg-green-600"
                            />
                            <Label className="font-medium">
                              {coaching.isActive ? 'Active' : 'Inactive'}
                            </Label>
                            <span className="text-sm text-muted-foreground">
                              ({coaching.isActive ? 'Visible to users' : 'Hidden from users'})
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-muted rounded-md">
                          <Badge variant={coaching.isActive ? "default" : "secondary"}>
                            {coaching.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                {mainProfile && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Established</p>
                      <p className="font-semibold">{mainProfile.establishedYear}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Courses</p>
                      <p className="font-semibold">{mainProfile.courses?.length || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Teachers</p>
                      <p className="font-semibold">{mainProfile.teachers?.length || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Star className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold">{mainProfile.rating || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="organization" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Organization Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Organization Name</Label>
                      {editMode ? (
                        <Input
                          value={coaching.organizationName}
                          onChange={(e) => setCoaching({
                            ...coaching,
                            organizationName: e.target.value
                          })}
                        />
                      ) : (
                        <p className="p-3 bg-muted rounded-md">{coaching.organizationName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Business Type</Label>
                      {editMode ? (
                        <Select
                          value={coaching.businessType}
                          onValueChange={(value: 'Individual' | 'Partnership' | 'Company' | 'Trust') => 
                            setCoaching({ ...coaching, businessType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Individual">Individual</SelectItem>
                            <SelectItem value="Partnership">Partnership</SelectItem>
                            <SelectItem value="Company">Company</SelectItem>
                            <SelectItem value="Trust">Trust</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="p-3 bg-muted rounded-md">{coaching.businessType}</p>
                      )}
                    </div>

                    <div>
                      <Label>GST Number</Label>
                      {editMode ? (
                        <Input
                          value={coaching.gstNumber || ''}
                          onChange={(e) => setCoaching({
                            ...coaching,
                            gstNumber: e.target.value
                          })}
                        />
                      ) : (
                        <p className="p-3 bg-muted rounded-md">{coaching.gstNumber || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <Label>PAN Number</Label>
                      {editMode ? (
                        <Input
                          value={coaching.panNumber || ''}
                          onChange={(e) => setCoaching({
                            ...coaching,
                            panNumber: e.target.value
                          })}
                        />
                      ) : (
                        <p className="p-3 bg-muted rounded-md">{coaching.panNumber || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                {mainProfile && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Profile Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Profile Name</Label>
                        {editMode ? (
                          <Input
                            value={mainProfile.name}
                            onChange={(e) => {
                              const updatedProfiles = [...coaching.profiles];
                              updatedProfiles[0] = { ...mainProfile, name: e.target.value };
                              setCoaching({ ...coaching, profiles: updatedProfiles });
                            }}
                          />
                        ) : (
                          <p className="p-3 bg-muted rounded-md">{mainProfile.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label>Branch Name</Label>
                        {editMode ? (
                          <Input
                            value={mainProfile.branchName || ''}
                            onChange={(e) => {
                              const updatedProfiles = [...coaching.profiles];
                              updatedProfiles[0] = { ...mainProfile, branchName: e.target.value };
                              setCoaching({ ...coaching, profiles: updatedProfiles });
                            }}
                          />
                        ) : (
                          <p className="p-3 bg-muted rounded-md">{mainProfile.branchName || 'Not specified'}</p>
                        )}
                      </div>

                      <div>
                        <Label>Established Year</Label>
                        {editMode ? (
                          <Input
                            type="number"
                            value={mainProfile.establishedYear}
                            onChange={(e) => {
                              const updatedProfiles = [...coaching.profiles];
                              updatedProfiles[0] = { ...mainProfile, establishedYear: parseInt(e.target.value) || new Date().getFullYear() };
                              setCoaching({ ...coaching, profiles: updatedProfiles });
                            }}
                          />
                        ) : (
                          <p className="p-3 bg-muted rounded-md">{mainProfile.establishedYear}</p>
                        )}
                      </div>

                      <div>
                        <Label>Tagline</Label>
                        {editMode ? (
                          <Input
                            value={mainProfile.tagline || ''}
                            onChange={(e) => {
                              const updatedProfiles = [...coaching.profiles];
                              updatedProfiles[0] = { ...mainProfile, tagline: e.target.value };
                              setCoaching({ ...coaching, profiles: updatedProfiles });
                            }}
                          />
                        ) : (
                          <p className="p-3 bg-muted rounded-md">{mainProfile.tagline || 'Not specified'}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        {editMode ? (
                          <Textarea
                            value={mainProfile.description}
                            onChange={(e) => {
                              const updatedProfiles = [...coaching.profiles];
                              updatedProfiles[0] = { ...mainProfile, description: e.target.value };
                              setCoaching({ ...coaching, profiles: updatedProfiles });
                            }}
                            rows={3}
                          />
                        ) : (
                          <p className="p-3 bg-muted rounded-md">{mainProfile.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                {mainProfile && (
                  <>
                    {/* Location Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Location Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>Address</Label>
                          {editMode ? (
                            <Textarea
                              value={mainProfile.address}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, address: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                              rows={2}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.address}</p>
                          )}
                        </div>

                        <div>
                          <Label>Landmark</Label>
                          {editMode ? (
                            <Input
                              value={mainProfile.landmark || ''}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, landmark: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.landmark || 'Not specified'}</p>
                          )}
                        </div>

                        <div>
                          <Label>PIN Code</Label>
                          {editMode ? (
                            <Input
                              value={mainProfile.pincode}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, pincode: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.pincode}</p>
                          )}
                        </div>

                        <div>
                          <Label>City</Label>
                          {editMode ? (
                            <Input
                              value={mainProfile.city}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, city: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.city}</p>
                          )}
                        </div>

                        <div>
                          <Label>State</Label>
                          {editMode ? (
                            <Input
                              value={mainProfile.state}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, state: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.state}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Primary Contact</Label>
                          {editMode ? (
                            <Input
                              value={mainProfile.contactNumber}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, contactNumber: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.contactNumber}</p>
                          )}
                        </div>

                        <div>
                          <Label>Alternate Contact</Label>
                          {editMode ? (
                            <Input
                              value={mainProfile.alternateNumber || ''}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, alternateNumber: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.alternateNumber || 'Not provided'}</p>
                          )}
                        </div>

                        <div>
                          <Label>Email</Label>
                          {editMode ? (
                            <Input
                              type="email"
                              value={mainProfile.email}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, email: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.email}</p>
                          )}
                        </div>

                        <div>
                          <Label>Website</Label>
                          {editMode ? (
                            <Input
                              value={mainProfile.website || ''}
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, website: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.website || 'Not provided'}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Operating Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Operating Hours</Label>
                          {editMode ? (
                            <Input
                              value={mainProfile.operatingHours}
                              placeholder="e.g., 9:00 AM - 6:00 PM"
                              onChange={(e) => {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { ...mainProfile, operatingHours: e.target.value };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }}
                            />
                          ) : (
                            <p className="p-3 bg-muted rounded-md">{mainProfile.operatingHours}</p>
                          )}
                        </div>

                        <div>
                          <Label>Operating Days</Label>
                          <div className="p-3 bg-muted rounded-md">
                            {mainProfile.operatingDays.length > 0 ? mainProfile.operatingDays.join(', ') : 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>              <TabsContent value="academic" className="space-y-6">
                {mainProfile && (
                  <>
                    {/* Subjects Offered */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Subjects Offered</h3>
                        {editMode && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newSubject = prompt('Enter subject name:');
                              if (newSubject && newSubject.trim() && !mainProfile.subjectsOffered.includes(newSubject.trim())) {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { 
                                  ...mainProfile, 
                                  subjectsOffered: [...mainProfile.subjectsOffered, newSubject.trim()] 
                                };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Subject
                          </Button>
                        )}
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {mainProfile.subjectsOffered.map((subject) => (
                            <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                              {subject}
                              {editMode && (
                                <X 
                                  className="h-3 w-3 cursor-pointer ml-1" 
                                  onClick={() => {
                                    const updatedProfiles = [...coaching.profiles];
                                    updatedProfiles[0] = { 
                                      ...mainProfile, 
                                      subjectsOffered: mainProfile.subjectsOffered.filter(s => s !== subject) 
                                    };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                />
                              )}
                            </Badge>
                          ))}
                          {mainProfile.subjectsOffered.length === 0 && (
                            <p className="text-muted-foreground">No subjects specified</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Exams Offered */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Exams Prepared</h3>
                        {editMode && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newExam = prompt('Enter exam name:');
                              if (newExam && newExam.trim() && !mainProfile.examsOffered.includes(newExam.trim())) {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { 
                                  ...mainProfile, 
                                  examsOffered: [...mainProfile.examsOffered, newExam.trim()] 
                                };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Exam
                          </Button>
                        )}
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {mainProfile.examsOffered.map((exam) => (
                            <Badge key={exam} variant="outline" className="flex items-center gap-1">
                              {exam}
                              {editMode && (
                                <X 
                                  className="h-3 w-3 cursor-pointer ml-1" 
                                  onClick={() => {
                                    const updatedProfiles = [...coaching.profiles];
                                    updatedProfiles[0] = { 
                                      ...mainProfile, 
                                      examsOffered: mainProfile.examsOffered.filter(e => e !== exam) 
                                    };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                />
                              )}
                            </Badge>
                          ))}
                          {mainProfile.examsOffered.length === 0 && (
                            <p className="text-muted-foreground">No exams specified</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Facilities Available</h3>
                        {editMode && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newFacility = prompt('Enter facility name:');
                              if (newFacility && newFacility.trim() && !mainProfile.facilities.includes(newFacility.trim())) {
                                const updatedProfiles = [...coaching.profiles];
                                updatedProfiles[0] = { 
                                  ...mainProfile, 
                                  facilities: [...mainProfile.facilities, newFacility.trim()] 
                                };
                                setCoaching({ ...coaching, profiles: updatedProfiles });
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Facility
                          </Button>
                        )}
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {mainProfile.facilities.map((facility) => (
                            <Badge key={facility} variant="secondary" className="flex items-center gap-1">
                              {facility}
                              {editMode && (
                                <X 
                                  className="h-3 w-3 cursor-pointer ml-1" 
                                  onClick={() => {
                                    const updatedProfiles = [...coaching.profiles];
                                    updatedProfiles[0] = { 
                                      ...mainProfile, 
                                      facilities: mainProfile.facilities.filter(f => f !== facility) 
                                    };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                />
                              )}
                            </Badge>
                          ))}
                          {mainProfile.facilities.length === 0 && (
                            <p className="text-muted-foreground">No facilities specified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>              <TabsContent value="courses" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Courses Offered</h3>
                  {editMode && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        const courseName = prompt('Enter course name:');
                        if (courseName && courseName.trim()) {
                          const courseAmount = prompt('Enter course fee (in ₹):');
                          if (courseAmount && !isNaN(Number(courseAmount))) {
                            const newCourse = {
                              id: `course_${Date.now()}`,
                              courseName: courseName.trim(),
                              courseAmount: Number(courseAmount),
                              courseDescription: '',
                              courseDuration: ''
                            };
                            const updatedProfiles = [...coaching.profiles];
                            updatedProfiles[0] = { 
                              ...mainProfile, 
                              courses: [...(mainProfile.courses || []), newCourse] 
                            };
                            setCoaching({ ...coaching, profiles: updatedProfiles });
                          }
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  )}
                </div>

                {mainProfile?.courses && mainProfile.courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mainProfile.courses.map((course, index) => (
                      <Card key={course.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {editMode && (
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    const updatedProfiles = [...coaching.profiles];
                                    const updatedCourses = mainProfile.courses.filter(c => c.id !== course.id);
                                    updatedProfiles[0] = { ...mainProfile, courses: updatedCourses };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            <div>
                              <Label>Course Name</Label>
                              {editMode ? (
                                <Input
                                  value={course.courseName}
                                  onChange={(e) => {
                                    const updatedProfiles = [...coaching.profiles];
                                    const updatedCourses = [...mainProfile.courses];
                                    updatedCourses[index] = { ...course, courseName: e.target.value };
                                    updatedProfiles[0] = { ...mainProfile, courses: updatedCourses };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                />
                              ) : (
                                <p className="p-2 bg-muted rounded">{course.courseName}</p>
                              )}
                            </div>
                            <div>
                              <Label>Course Fee (₹)</Label>
                              {editMode ? (
                                <Input
                                  type="number"
                                  value={course.courseAmount}
                                  onChange={(e) => {
                                    const updatedProfiles = [...coaching.profiles];
                                    const updatedCourses = [...mainProfile.courses];
                                    updatedCourses[index] = { ...course, courseAmount: parseInt(e.target.value) || 0 };
                                    updatedProfiles[0] = { ...mainProfile, courses: updatedCourses };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                />
                              ) : (
                                <p className="p-2 bg-muted rounded">₹{course.courseAmount.toLocaleString()}</p>
                              )}
                            </div>
                            {editMode && (
                              <>
                                <div>
                                  <Label>Course Description</Label>
                                  <Textarea
                                    value={course.courseDescription || ''}
                                    onChange={(e) => {
                                      const updatedProfiles = [...coaching.profiles];
                                      const updatedCourses = [...mainProfile.courses];
                                      updatedCourses[index] = { ...course, courseDescription: e.target.value };
                                      updatedProfiles[0] = { ...mainProfile, courses: updatedCourses };
                                      setCoaching({ ...coaching, profiles: updatedProfiles });
                                    }}
                                    rows={2}
                                  />
                                </div>
                                <div>
                                  <Label>Course Duration</Label>
                                  <Input
                                    value={course.courseDuration || ''}
                                    placeholder="e.g., 6 months, 1 year"
                                    onChange={(e) => {
                                      const updatedProfiles = [...coaching.profiles];
                                      const updatedCourses = [...mainProfile.courses];
                                      updatedCourses[index] = { ...course, courseDuration: e.target.value };
                                      updatedProfiles[0] = { ...mainProfile, courses: updatedCourses };
                                      setCoaching({ ...coaching, profiles: updatedProfiles });
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No courses added yet</p>
                    {editMode && (
                      <Button 
                        className="mt-4"
                        onClick={() => {
                          const courseName = prompt('Enter course name:');
                          if (courseName && courseName.trim()) {
                            const courseAmount = prompt('Enter course fee (in ₹):');
                            if (courseAmount && !isNaN(Number(courseAmount))) {
                              const newCourse = {
                                id: `course_${Date.now()}`,
                                courseName: courseName.trim(),
                                courseAmount: Number(courseAmount),
                                courseDescription: '',
                                courseDuration: ''
                              };
                              const updatedProfiles = [...coaching.profiles];
                              updatedProfiles[0] = { 
                                ...mainProfile, 
                                courses: [newCourse] 
                              };
                              setCoaching({ ...coaching, profiles: updatedProfiles });
                            }
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Course
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>              <TabsContent value="teachers" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Teachers</h3>
                  {editMode && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        const teacherName = prompt('Enter teacher name:');
                        if (teacherName && teacherName.trim()) {
                          const qualification = prompt('Enter qualification:');
                          const experience = prompt('Enter years of experience:');
                          if (qualification && experience && !isNaN(Number(experience))) {
                            const newTeacher = {
                              id: `teacher_${Date.now()}`,
                              name: teacherName.trim(),
                              qualification: qualification.trim(),
                              experience: Number(experience),
                              profileImage: '',
                              bio: '',
                              specialization: []
                            };
                            const updatedProfiles = [...coaching.profiles];
                            updatedProfiles[0] = { 
                              ...mainProfile, 
                              teachers: [...(mainProfile.teachers || []), newTeacher] 
                            };
                            setCoaching({ ...coaching, profiles: updatedProfiles });
                          }
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Teacher
                    </Button>
                  )}
                </div>

                {mainProfile?.teachers && mainProfile.teachers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mainProfile.teachers.map((teacher, index) => (
                      <Card key={teacher.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {editMode && (
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    const updatedProfiles = [...coaching.profiles];
                                    const updatedTeachers = mainProfile.teachers.filter(t => t.id !== teacher.id);
                                    updatedProfiles[0] = { ...mainProfile, teachers: updatedTeachers };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {teacher.profileImage ? (
                                  <img 
                                    src={teacher.profileImage} 
                                    alt={teacher.name}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  teacher.name.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="flex-1">
                                {editMode ? (
                                  <Input
                                    value={teacher.name}
                                    onChange={(e) => {
                                      const updatedProfiles = [...coaching.profiles];
                                      const updatedTeachers = [...mainProfile.teachers];
                                      updatedTeachers[index] = { ...teacher, name: e.target.value };
                                      updatedProfiles[0] = { ...mainProfile, teachers: updatedTeachers };
                                      setCoaching({ ...coaching, profiles: updatedProfiles });
                                    }}
                                    className="font-semibold"
                                  />
                                ) : (
                                  <p className="font-semibold">{teacher.name}</p>
                                )}
                                {editMode ? (
                                  <Input
                                    value={teacher.qualification}
                                    onChange={(e) => {
                                      const updatedProfiles = [...coaching.profiles];
                                      const updatedTeachers = [...mainProfile.teachers];
                                      updatedTeachers[index] = { ...teacher, qualification: e.target.value };
                                      updatedProfiles[0] = { ...mainProfile, teachers: updatedTeachers };
                                      setCoaching({ ...coaching, profiles: updatedProfiles });
                                    }}
                                    className="text-sm mt-1"
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground">{teacher.qualification}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <Label>Experience</Label>
                              {editMode ? (
                                <Input
                                  type="number"
                                  value={teacher.experience}
                                  onChange={(e) => {
                                    const updatedProfiles = [...coaching.profiles];
                                    const updatedTeachers = [...mainProfile.teachers];
                                    updatedTeachers[index] = { ...teacher, experience: Number(e.target.value) || 0 };
                                    updatedProfiles[0] = { ...mainProfile, teachers: updatedTeachers };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                />
                              ) : (
                                <p className="p-2 bg-muted rounded text-sm">{teacher.experience} years</p>
                              )}
                            </div>
                            {editMode ? (
                              <div>
                                <Label>Bio</Label>
                                <Textarea
                                  value={teacher.bio || ''}
                                  onChange={(e) => {
                                    const updatedProfiles = [...coaching.profiles];
                                    const updatedTeachers = [...mainProfile.teachers];
                                    updatedTeachers[index] = { ...teacher, bio: e.target.value };
                                    updatedProfiles[0] = { ...mainProfile, teachers: updatedTeachers };
                                    setCoaching({ ...coaching, profiles: updatedProfiles });
                                  }}
                                  rows={2}
                                  placeholder="Brief description about the teacher..."
                                />
                              </div>
                            ) : (
                              teacher.bio && (
                                <div>
                                  <Label>Bio</Label>
                                  <p className="p-2 bg-muted rounded text-sm">{teacher.bio}</p>
                                </div>
                              )
                            )}
                            {teacher.specialization && teacher.specialization.length > 0 && (
                              <div>
                                <Label>Specialization</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {teacher.specialization.map((spec) => (
                                    <Badge key={spec} variant="outline" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No teachers added yet</p>
                    {editMode && (
                      <Button 
                        className="mt-4"
                        onClick={() => {
                          const teacherName = prompt('Enter teacher name:');
                          if (teacherName && teacherName.trim()) {
                            const qualification = prompt('Enter qualification:');
                            const experience = prompt('Enter years of experience:');
                            if (qualification && experience && !isNaN(Number(experience))) {
                              const newTeacher = {
                                id: `teacher_${Date.now()}`,
                                name: teacherName.trim(),
                                qualification: qualification.trim(),
                                experience: Number(experience),
                                profileImage: '',
                                bio: '',
                                specialization: []
                              };
                              const updatedProfiles = [...coaching.profiles];
                              updatedProfiles[0] = { 
                                ...mainProfile, 
                                teachers: [newTeacher] 
                              };
                              setCoaching({ ...coaching, profiles: updatedProfiles });
                            }
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Teacher
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageCoachingPage;