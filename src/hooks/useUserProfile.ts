import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileCompleted: boolean;
  phoneNumber?: string;
  city?: string;
  classLevel?: string;
  age?: number;
  schoolOrCollege?: string;
  lookingFor?: string;
  bio?: string;
  interests: string[];
  learningGoals: string[];
  coachingMode?: 'Online' | 'Offline' | 'Both';
  preferredSubjects: string[];
  targetExams: string[];
  studyLevel?: 'School' | 'College' | 'Competitive' | 'Professional';
  preferredCities: string[];
  budgetRange?: string;
  sessionTimings: string[];
  onlineClassFormat?: string;
  devicePreference?: string;
  internetSpeed?: string;
  maxTravelDistance?: string;
  transportMode?: string;
  batchSize?: 'Individual' | 'Small' | 'Medium' | 'Large';
}

export function useUserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/complete-profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session?.user?.id]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  };
}
