import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <img src="/assets/logo.png" alt="Coaching Kart" className="h-8 md:h-10 w-auto mb-3" />
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Empowering students with quality coaching. Your success is our mission.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/coaching" className="text-sm text-gray-600 hover:text-[#0F52BA] transition-colors">Explore</Link></li>
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-[#0F52BA] transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="text-sm text-gray-600 hover:text-[#0F52BA] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-[#0F52BA] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-[#0F52BA] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright only */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-500">© 2025 Coaching Kart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;