"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Lightbulb, Pencil, Sparkles, Brain } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'fun';
  className?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  variant = 'fun', 
  className, 
  text 
}) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  
  const icons = [
    { Icon: BookOpen, color: 'text-blue-500' },
    { Icon: GraduationCap, color: 'text-purple-500' },
    { Icon: Lightbulb, color: 'text-yellow-500' },
    { Icon: Brain, color: 'text-pink-500' },
    { Icon: Pencil, color: 'text-green-500' },
    { Icon: Sparkles, color: 'text-orange-500' },
  ];

  useEffect(() => {
    if (variant === 'fun') {
      const interval = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % icons.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const SpinnerLoader = () => (
    <div className={cn(
      'animate-spin rounded-full border-2 border-gray-200 border-t-[#0F52BA]',
      size === 'sm' ? 'w-4 h-4' : 'w-6 h-6',
      className
    )} />
  );

  const FunLoader = () => {
    const CurrentIcon = icons[currentIconIndex].Icon;
    const iconColor = icons[currentIconIndex].color;

    return (
      <div className="relative flex items-center justify-center">
        {/* Bouncing Icon */}
        <div className={cn("animate-bounce transition-colors duration-500", iconColor)}>
          <CurrentIcon className={cn(sizeClasses[size].split(' ')[0], sizeClasses[size].split(' ')[1])} />
        </div>
        
        {/* Little shadow ripple */}
        <div className="absolute -bottom-2 w-8 h-1 bg-gray-200 rounded-full animate-pulse opacity-50 blur-[1px]" />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === 'fun' ? <FunLoader /> : <SpinnerLoader />}
      {text && (
        <p className="text-gray-500 font-medium text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Full page loader
interface PageLoaderProps {
  text?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  text = "Loading..." 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
    <Loader size="lg" variant="fun" text={text} />
  </div>
);

// Card loader
export const CardLoader: React.FC<{ text?: string }> = ({ 
  text = "Loading..." 
}) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader size="md" variant="fun" text={text} />
  </div>
);

// Button loader - Keep simple spinner for small buttons
export const ButtonLoader: React.FC<{ size?: 'sm' | 'md' }> = ({ 
  size = 'sm' 
}) => (
  <div className={cn(
    'animate-spin rounded-full border-2 border-white/30 border-t-white',
    size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  )} />
);

export default Loader;
