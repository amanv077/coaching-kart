import React from 'react';
import Link from 'next/link';
import { Button } from './button';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  backgroundColor?: string;
  pattern?: boolean;
}

const CTASection = ({ 
  title, 
  description, 
  buttonText, 
  buttonHref, 
  backgroundColor = "bg-gradient-to-r from-[hsl(205_100%_50%)] to-[hsl(220_100%_45%)]", 
  pattern = true 
}: CTASectionProps) => {
  // Determine if we're on a dark background (gradient) where white text is appropriate
  const isDarkBackground = backgroundColor.includes('gradient') || backgroundColor.includes('dark');
  const textColorClass = isDarkBackground ? 'text-white' : 'text-foreground';
  const subtextColorClass = isDarkBackground ? 'text-white/90' : 'text-muted-foreground';

  return (
    <section className={`relative py-16 md:py-20 px-4 overflow-hidden ${backgroundColor}`}>
      {/* Background Pattern */}
      {pattern && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-white rounded-full blur-2xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-10 right-10 w-28 h-28 bg-white rounded-full blur-2xl animate-pulse delay-3000"></div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in ${textColorClass}`}>
            {title}
          </h2>
          
          <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up ${subtextColorClass}`}>
            {description}
          </p>
          
          <div className="animate-bounce-gentle">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white text-[hsl(205_100%_50%)] hover:bg-white/90 border-white shadow-lg hover:shadow-blue transition-all duration-300" 
              asChild
            >
              <Link href={buttonHref} className="group">
                {buttonText}
                <span className="ml-2 group-hover:translate-x-1 transition-transform">🚀</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
