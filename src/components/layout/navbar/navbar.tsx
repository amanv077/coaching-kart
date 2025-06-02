"use client";

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';

const Navbar = () => {
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
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;