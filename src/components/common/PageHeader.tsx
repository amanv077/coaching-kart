import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <div className="relative py-16 md:py-24 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-coaching-primary/10 to-coaching-accent/10 z-0"></div>
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-coaching-gradient bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
    
    {/* Decorative elements */}
    <div className="absolute left-0 top-1/4 -translate-x-1/2 w-64 h-64 rounded-full bg-coaching-primary/10 blur-3xl"></div>
    <div className="absolute right-0 bottom-1/4 translate-x-1/2 w-64 h-64 rounded-full bg-coaching-accent/10 blur-3xl"></div>
  </div>
);

export default PageHeader;