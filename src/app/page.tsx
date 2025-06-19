"use client";

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HomePage from "@/components/layout/homepage/page";
import { PageLoader } from '@/components/ui/loader';
import { UserRole } from '@/types/auth';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const getDashboardLink = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return '/dashboard';
      case 'COACH':
        return '/coaching-dashboard';
      case 'ADMIN':
        return '/admin-dashboard';
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    // If user is logged in, redirect to their dashboard
    if (session?.user?.role) {
      const dashboardLink = getDashboardLink(session.user.role as UserRole);
      router.replace(dashboardLink);
    }
  }, [session, router]);

  // Show loading while checking session
  if (status === 'loading') {
    return <PageLoader text="Loading..." />;
  }

  // If user is logged in, they will be redirected above
  // This component will only render for non-logged-in users
  return <HomePage />;
}
