import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-coaching-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CK</span>
              </div>
              <span className="font-bold text-xl text-foreground">Coaching Kart</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Empowering students with quality coaching and mentorship. 
              Your success is our mission.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                Follow Us
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-coaching-primary transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/coaches" className="text-muted-foreground hover:text-coaching-primary transition-colors">
                  Coaches
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-coaching-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-coaching-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-coaching-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-coaching-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-coaching-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-coaching-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-border" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Coaching Kart. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-coaching-primary text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-coaching-primary text-sm transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-coaching-primary text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;