import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroSectionProps {
  title: string | React.ReactNode;
  subtitle?: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: HeroSectionProps) => {
  return (
    <section className="relative py-20 md:py-32 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {subtitle && (
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 border border-primary/20">
              {subtitle}
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8 py-6 text-lg premium-shadow" asChild>
              <Link href={primaryButtonHref} className="group">
                {primaryButtonText}
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
            
            {secondaryButtonText && secondaryButtonHref && (
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300" asChild>
                <Link href={secondaryButtonHref}>
                  {secondaryButtonText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
