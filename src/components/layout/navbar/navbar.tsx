"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
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
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
    // Add timeout for session loading to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSessionLoaded(true);
    }, 2000); // Reduced to 2 seconds

    if (status !== 'loading') {
      clearTimeout(timer);
      setIsSessionLoaded(true);
    }

    return () => clearTimeout(timer);
  }, [status]);

  const isLoading = status === 'loading' && !isSessionLoaded;
  
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
  const handleHomeClick = () => {
    if (session?.user?.role) {
      const dashboardLink = getDashboardLink(session.user.role as UserRole);
      return dashboardLink;
    }
    return '/';
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

  return (    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">        {/* Logo */}
        <Link href={handleHomeClick()} className="flex items-center space-x-2">
          <div className="ml-2 h-10 md:h-12">
            <img
              src="/assets/logo.png"
              alt="Coaching Kart Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/coaching"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Explore
          </Link>
          {/* Dashboard link shown only when logged in */}
          {session && (
            <Link
              href={getDashboardLink(session.user?.role as UserRole)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/about"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Contact Us
          </Link>
        </div>        {/* Desktop Right Side Actions */}
        <div className="hidden md:flex items-center space-x-4 m-2">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          ) : session ? (            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-gray-200 hover:border-blue-300 cursor-pointer"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-gray-700">{session.user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {session.user?.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(session.user?.roles || [session.user?.role]).map(
                          (role: string) => (
                            <span
                              key={role}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium"
                            >
                              {role}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <div className="py-2">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link 
                      href={getDashboardLink(session.user?.role as UserRole)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {/* Show additional dashboard links for users with multiple roles */}
                  {(session.user?.roles || []).length > 1 && (
                    <>
                      {(session.user?.roles || [])
                        .filter((role: string) => role !== session.user?.role)
                        .map((role: string) => (
                          <DropdownMenuItem key={role} asChild className="cursor-pointer">
                            <Link 
                              href={getDashboardLink(role as UserRole)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              {role.charAt(0) + role.slice(1).toLowerCase()} Dashboard
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      <DropdownMenuSeparator className="my-1" />
                    </>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link 
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  {(session.user?.roles || [session.user?.role]).includes("STUDENT") && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link 
                        href="/cart"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                        Cart
                      </Link>
                    </DropdownMenuItem>
                  )}
                </div>
                <DropdownMenuSeparator className="my-0" />
                <div className="py-2">
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" className="border-gray-200 hover:border-blue-300 hover:bg-blue-50" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>        {/* Mobile Menu Button and User Actions */}
        <div className="flex md:hidden items-center space-x-2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : session ? (            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-2 border-gray-200 cursor-pointer">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {session.user?.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(session.user?.roles || [session.user?.role]).map(
                          (role: string) => (
                            <span
                              key={role}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium"
                            >
                              {role}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <div className="py-2">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link 
                      href={getDashboardLink(session.user?.role as UserRole)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {/* Show additional dashboard links for users with multiple roles */}
                  {(session.user?.roles || []).length > 1 && (
                    <>
                      {(session.user?.roles || [])
                        .filter((role: string) => role !== session.user?.role)
                        .map((role: string) => (
                          <DropdownMenuItem key={role} asChild className="cursor-pointer">
                            <Link 
                              href={getDashboardLink(role as UserRole)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              {role.charAt(0) + role.slice(1).toLowerCase()} Dashboard
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      <DropdownMenuSeparator className="my-1" />
                    </>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link 
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  {(session.user?.roles || [session.user?.role]).includes("STUDENT") && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link 
                        href="/cart"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                        Cart
                      </Link>
                    </DropdownMenuItem>
                  )}
                </div>
                <DropdownMenuSeparator className="my-0" />
                <div className="py-2">
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-200 text-xs px-3" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}

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
      </div>      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="container py-4 space-y-3">            {/* Navigation Links */}
            <div className="space-y-3">
              <Link
                href={handleHomeClick()}
                className="block text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              
              <Link
                href="/coaching"
                className="block text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                Coachings
              </Link>

              {session && (
                <Link
                  href={getDashboardLink(session.user?.role as UserRole)}
                  className="block text-blue-600 hover:text-blue-700 font-medium transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              )}

              <Link
                href="/about"
                className="block text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link
                href="/contact-us"
                className="block text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium"
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
            </div>            {/* Auth Buttons for non-logged in users */}
            {!session && !isLoading && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Button variant="outline" size="sm" className="w-full border-gray-200 hover:border-blue-300" asChild>
                  <Link href="/login" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/register" onClick={closeMobileMenu}>
                    Get Started
                  </Link>
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