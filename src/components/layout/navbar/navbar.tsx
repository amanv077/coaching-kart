"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/auth';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">          
          <div className=" ml-2 h-10 md:h-14">
            <img 
              src="/assets/logo.png" 
              alt="Coaching Kart Logo" 
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">          <Link 
            href="/coaching" 
            className="text-muted-foreground hover:text-[hsl(205_100%_50%)] transition-colors"
          >
            Coachings
          </Link>
          
          {/* Dashboard link shown only when logged in */}
          {session && (
            <Link 
              href={getDashboardLink(session.user?.role as UserRole)}
              className="text-[hsl(205_100%_50%)] hover:text-[hsl(205_100%_60%)] font-medium transition-colors"
            >
              Dashboard
            </Link>
          )}
          
          <Link 
            href="/about" 
            className="text-muted-foreground hover:text-[hsl(205_100%_50%)] transition-colors"
          >
            About Us
          </Link>
          <Link 
            href="/contact-us" 
            className="text-muted-foreground hover:text-[hsl(205_100%_50%)] transition-colors"
          >
            Contact Us
          </Link>
        </div>
        
        {/* Desktop Right Side Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
            {status === 'loading' ? (
            <Loader size="sm" />
          ) : session ? (
            <DropdownMenu>              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-coaching-gradient rounded-full flex items-center justify-center">
                    <span className="text-black dark:text-white text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:inline">{session.user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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

        {/* Mobile Menu Button and User Actions */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
            {status === 'loading' ? (
            <Loader size="sm" />
          ) : session ? (
            <DropdownMenu>              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-2">
                  <div className="w-6 h-6 bg-coaching-gradient rounded-full flex items-center justify-center">
                    <span className="text-foreground dark:text-white text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
          ) : null}
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-3">
            {/* Navigation Links */}
            <div className="space-y-3">
              <Link 
                href="/coaching" 
                className="block text-muted-foreground hover:text-coaching-primary transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Coachings
              </Link>
              
              {session && (
                <Link 
                  href={getDashboardLink(session.user?.role as UserRole)}
                  className="block text-coaching-primary hover:text-coaching-primary/80 font-medium transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              )}
              
              <Link 
                href="/about" 
                className="block text-muted-foreground hover:text-coaching-primary transition-colors py-2"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link 
                href="/contact-us" 
                className="block text-muted-foreground hover:text-coaching-primary transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
            </div>

            {/* Auth Buttons for non-logged in users */}
            {!session && status !== 'loading' && (
              <div className="pt-4 border-t border-border space-y-3">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/login" onClick={closeMobileMenu}>Sign In</Link>
                </Button>
                <Button variant="default" size="sm" className="w-full" asChild>
                  <Link href="/register" onClick={closeMobileMenu}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;