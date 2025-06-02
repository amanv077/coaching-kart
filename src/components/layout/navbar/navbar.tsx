"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/auth';

const Navbar = () => {
  const { data: session, status } = useSession();
  
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

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-coaching-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CK</span>
          </div>
          <span className="font-bold text-xl text-foreground">Coaching Kart</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/courses" 
            className="text-muted-foreground hover:text-coaching-primary transition-colors"
          >
            Courses
          </Link>
          <Link 
            href="/coaches" 
            className="text-muted-foreground hover:text-coaching-primary transition-colors"
          >
            Coaches
          </Link>
          <Link 
            href="/about" 
            className="text-muted-foreground hover:text-coaching-primary transition-colors"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-muted-foreground hover:text-coaching-primary transition-colors"
          >
            Contact
          </Link>
        </div>        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {status === 'loading' ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-coaching-gradient rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:inline">{session.user?.name}</span>
                </Button>
              </DropdownMenuTrigger>              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                    <div className="flex flex-wrap gap-1">
                      {(session.user?.roles || [session.user?.role]).map((role: string) => (
                        <p key={role} className="text-xs bg-coaching-secondary/20 text-coaching-secondary px-1 py-0.5 rounded">
                          {role}
                        </p>
                      ))}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink(session.user?.role as UserRole)}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                
                {/* Show additional dashboard links for users with multiple roles */}
                {(session.user?.roles || []).length > 1 && (
                  <>
                    {(session.user?.roles || []).filter((role: string) => role !== session.user?.role).map((role: string) => (
                      <DropdownMenuItem key={role} asChild>
                        <Link href={getDashboardLink(role as UserRole)}>
                          {role.charAt(0) + role.slice(1).toLowerCase()} Dashboard
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {(session.user?.roles || [session.user?.role]).includes('STUDENT') && (
                  <DropdownMenuItem asChild>
                    <Link href="/cart">Cart</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;