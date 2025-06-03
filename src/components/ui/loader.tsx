"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  variant = 'spinner', 
  className, 
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };
  const SpinnerLoader = () => (
    <div className={cn(
      'animate-spin rounded-full border-4 border-gray-200 border-t-coaching-primary',
      sizeClasses[size],
      className
    )} />
  );

  const DotsLoader = () => (
    <div className={cn('flex space-x-1', className)}>      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-coaching-primary rounded-full animate-pulse',
            {
              'w-2 h-2': size === 'sm',
              'w-3 h-3': size === 'md',
              'w-4 h-4': size === 'lg',
              'w-5 h-5': size === 'xl'
            }
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
  const PulseLoader = () => (
    <div className={cn(
      'bg-coaching-primary rounded-full animate-ping',
      sizeClasses[size],
      className
    )} />
  );

  const BarsLoader = () => (
    <div className={cn('flex items-end space-x-1', className)}>      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-coaching-primary animate-pulse',
            {
              'w-1 h-4': size === 'sm',
              'w-1.5 h-6': size === 'md',
              'w-2 h-8': size === 'lg',
              'w-3 h-10': size === 'xl'
            }
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.2s'
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'bars':
        return <BarsLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && (
        <p className={cn(
          'text-gray-600 font-medium',
          textSizes[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

// Full page loader component
interface PageLoaderProps {
  text?: string;
  variant?: LoaderProps['variant'];
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  text = "Loading...", 
  variant = 'spinner' 
}) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
      <Loader size="lg" variant={variant} />
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  </div>
);

// Card loader component
interface CardLoaderProps {
  text?: string;
  variant?: LoaderProps['variant'];
  className?: string;
}

export const CardLoader: React.FC<CardLoaderProps> = ({ 
  text = "Loading...", 
  variant = 'spinner',
  className 
}) => (
  <div className={cn(
    "flex flex-col items-center justify-center py-16 px-4",
    className
  )}>
    <Loader size="lg" variant={variant} />
    <p className="text-gray-600 font-medium mt-4">{text}</p>
  </div>
);

// Button loader component
interface ButtonLoaderProps {
  size?: LoaderProps['size'];
  variant?: LoaderProps['variant'];
  className?: string;
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({ 
  size = 'sm', 
  variant = 'spinner',
  className 
}) => (
  <Loader size={size} variant={variant} className={cn('text-white', className)} />
);

export default Loader;
