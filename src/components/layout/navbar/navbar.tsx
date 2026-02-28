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
import { 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  ShoppingCart,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSessionLoaded(true);
    }, 2000);

    if (status !== 'loading') {
      clearTimeout(timer);
      setIsSessionLoaded(true);
    }

    return () => clearTimeout(timer);
  }, [status]);

  const isLoading = status === 'loading' && !isSessionLoaded;
  
  const getDashboardLink = (role: UserRole) => {
    switch (role) {
      case 'STUDENT': return '/dashboard';
      case 'COACH': return '/coaching-dashboard';
      case 'ADMIN': return '/admin-dashboard';
      default: return '/dashboard';
    }
  };

  const handleHomeClick = () => {
    if (session?.user?.role) {
      return getDashboardLink(session.user.role as UserRole);
    }
    return '/';
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 h-auto rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-[#0F52BA] text-white flex items-center justify-center text-sm font-semibold shadow-sm group-hover:shadow transition-shadow">
            {session?.user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 text-left">
            <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
              {session?.user?.name}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 p-2 animate-in slide-in-from-top-2 fade-in-50">
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900">{session?.user?.name}</p>
            <p className="text-xs leading-none text-gray-500 truncate">{session?.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Dashboards */}
        <DropdownMenuItem asChild>
          <Link 
            href={getDashboardLink(session?.user?.role as UserRole)}
            className="flex items-center gap-2 cursor-pointer text-gray-700 focus:text-[#0F52BA] focus:bg-[#0F52BA]/5"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Additional Roles */}
        {(session?.user?.roles || []).length > 1 && (
          <div className="my-1 pl-6 space-y-1 border-l-2 border-gray-100 ml-2">
            {(session?.user?.roles || [])
              .filter((role: string) => role !== session?.user?.role)
              .map((role: string) => (
                <DropdownMenuItem key={role} asChild>
                  <Link 
                    href={getDashboardLink(role as UserRole)}
                    className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 focus:text-[#0F52BA]"
                  >
                    <span>Switch to {role.charAt(0) + role.slice(1).toLowerCase()}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link 
            href="/profile"
            className="flex items-center gap-2 cursor-pointer text-gray-700 focus:text-[#0F52BA] focus:bg-[#0F52BA]/5"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {(session?.user?.roles || [session?.user?.role]).includes("STUDENT") && (
          <DropdownMenuItem asChild>
            <Link 
              href="/cart"
              className="flex items-center gap-2 cursor-pointer text-gray-700 focus:text-[#0F52BA] focus:bg-[#0F52BA]/5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link 
            href="/settings"
            className="flex items-center gap-2 cursor-pointer text-gray-700 focus:text-[#0F52BA] focus:bg-[#0F52BA]/5"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={handleHomeClick()} className="flex items-center gap-2">
          <div className="h-9 md:h-10">
            <img
              src="/assets/logo.png"
              alt="Coaching Kart"
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href={handleHomeClick()}
            className="text-sm font-medium text-gray-600 hover:text-[#0F52BA] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/coaching"
            className="text-sm font-medium text-gray-600 hover:text-[#0F52BA] transition-colors"
          >
            Explore
          </Link>
          {session && (
            <Link
              href={getDashboardLink(session.user?.role as UserRole)}
              className="text-sm font-medium text-gray-600 hover:text-[#0F52BA] transition-colors"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-[#0F52BA] transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            className="text-sm font-medium text-gray-600 hover:text-[#0F52BA] transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F52BA]"></div>
            </div>
          ) : session ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-[#0F52BA] hover:bg-transparent">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-[#0F52BA] hover:bg-[#0A3D8F] text-white rounded-full px-6" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle & User Actions */}
        <div className="flex md:hidden items-center gap-3">
          {session && !isLoading && <UserMenu />}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg absolute w-full left-0">
          <div className="p-4 space-y-1">
            <Link
              href={handleHomeClick()}
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#0F52BA] hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/coaching"
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#0F52BA] hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              Explore Coachings
            </Link>
            {session && (
              <Link
                href={getDashboardLink(session.user?.role as UserRole)}
                className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#0F52BA] hover:bg-gray-50 rounded-lg"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/about"
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#0F52BA] hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#0F52BA] hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              Contact Us
            </Link>

            {!session && !isLoading && (
              <div className="pt-4 border-t border-gray-100 mt-2 flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-center rounded-full" asChild>
                  <Link href="/login" onClick={closeMobileMenu}>Sign In</Link>
                </Button>
                <Button className="w-full justify-center bg-[#0F52BA] hover:bg-[#0A3D8F] text-white rounded-full" asChild>
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