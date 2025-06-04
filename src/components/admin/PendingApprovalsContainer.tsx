"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Building2, Users } from 'lucide-react';

interface PendingProfile {
  id: string;
  profileId: string;
  name: string;
  city: string;
  state: string;
  coaching?: {
    organizationName: string;
  };
}

const PendingApprovalsContainer: React.FC = () => {
  const [pendingProfiles, setPendingProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await fetch('/api/admin/pending-approvals');
        if (!response.ok) {
          throw new Error('Failed to fetch pending approvals');
        }
        const data = await response.json();
        setPendingProfiles(data.pendingProfiles || []);
      } catch (err) {
        console.error('Error fetching pending approvals:', err);
        setError(err instanceof Error ? err.message : 'Failed to load pending approvals');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, []);

  const handleApprove = async (profileId: string) => {
    try {
      const response = await fetch('/api/admin/pending-approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          action: 'approve'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve profile');
      }      // Remove the approved profile from the list
      setPendingProfiles(prev => prev.filter((profile: PendingProfile) => profile.profileId !== profileId));
    } catch (err) {
      console.error('Error approving profile:', err);
    }
  };

  const handleReject = async (profileId: string) => {
    try {
      const response = await fetch('/api/admin/pending-approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          action: 'reject'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject profile');
      }      // Remove the rejected profile from the list
      setPendingProfiles(prev => prev.filter((profile: PendingProfile) => profile.profileId !== profileId));
    } catch (err) {
      console.error('Error rejecting profile:', err);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Coaching Profile Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Error Loading Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Coaching Profile Approvals
          <Badge variant="secondary">{pendingProfiles.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingProfiles.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No pending approvals</p>
              <p className="text-sm">All coaching profiles are up to date</p>
            </div>
          </div>
        ) : (          <div className="space-y-4">
            {pendingProfiles.slice(0, 5).map((profile: PendingProfile) => (
              <div
                key={profile.profileId}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{profile.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.coaching?.organizationName || 'Coaching Institute'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile.city}, {profile.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(profile.profileId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(profile.profileId)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
            {pendingProfiles.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  View All {pendingProfiles.length} Pending Approvals
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>  );
};

export default PendingApprovalsContainer;
