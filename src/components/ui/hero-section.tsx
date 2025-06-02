import React from 'react';
import Link from 'next/link';
import { Button } from './button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  backgroundPattern?: boolean;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  backgroundPattern = true
}: HeroSectionProps) => {
  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-coaching-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-coaching-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-coaching-accent rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      )}
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {subtitle && (
            <div className="inline-flex items-center px-4 py-2 bg-coaching-primary/10 text-coaching-primary rounded-full text-sm font-medium mb-6 animate-fade-in">
              ✨ {subtitle}
            </div>
          )}
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in leading-tight">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button variant="gradient" size="lg" className="shadow-coaching-button hover:shadow-coaching-hover transition-all duration-300" asChild>
              <Link href={primaryButtonHref} className="group">
                {primaryButtonText}
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
            
            {secondaryButtonText && secondaryButtonHref && (
              <Button variant="outline" size="lg" className="hover:bg-coaching-primary/10 hover:text-coaching-primary hover:border-coaching-primary transition-all duration-300" asChild>
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
