import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/auth';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    setLoading(false);
  }, [status]);

  const hasRole = (role: UserRole): boolean => {
    if (!session?.user?.roles) return false;
    return session.user.roles.includes(role);
  };
  const isAdmin = (): boolean => hasRole('ADMIN');
  const isCoach = (): boolean => hasRole('COACH');
  const isStudent = (): boolean => hasRole('STUDENT');

  const requireAuth = () => {
    if (!session?.user) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const requireRole = (role: UserRole) => {
    if (!requireAuth()) return false;
    
    if (!hasRole(role)) {
      router.push('/unauthorized');
      return false;
    }
    return true;
  };

  const requireAdmin = () => requireRole('ADMIN');
  const requireCoach = () => requireRole('COACH');
  const requireStudent = () => requireRole('STUDENT');

  return {
    user: session?.user || null,
    loading,
    isAuthenticated: !!session?.user,
    hasRole,
    isAdmin,
    isCoach,
    isStudent,
    requireAuth,
    requireRole,
    requireAdmin,
    requireCoach,
    requireStudent
  };
}
