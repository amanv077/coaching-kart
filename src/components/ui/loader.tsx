"use client";

import React from 'react';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'coaching' | 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  variant = 'coaching', 
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

  const CoachingLoader = () => {
    const ringSize = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20'
    };

    const logoSize = {
      sm: 'w-4 h-4 text-xs',
      md: 'w-6 h-6 text-sm',
      lg: 'w-8 h-8 text-base',
      xl: 'w-10 h-10 text-lg'
    };

    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="relative">
          {/* Optimized outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/15 to-blue-600/15 blur-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Main rotating ring */}
          <motion.div
            className={cn('border-[2px] rounded-full shadow-md', ringSize[size])}
            style={{
              background: "conic-gradient(from 0deg, #3b82f6, #1d4ed8, #1e40af, #3b82f6)",
              padding: "2px",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full" />
          </motion.div>

          {/* Center logo */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className={cn(
              'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-lg flex items-center justify-center shadow-lg border border-blue-400/20',
              logoSize[size]
            )}>
              <span className="text-white font-bold tracking-tight">C</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const SpinnerLoader = () => (
    <div className={cn(
      'animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500',
      sizeClasses[size],
      className
    )} />
  );

  const DotsLoader = () => (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse',
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
      'bg-blue-600 dark:bg-blue-500 rounded-full animate-ping',
      sizeClasses[size],
      className
    )} />
  );

  const BarsLoader = () => (
    <div className={cn('flex items-end space-x-1', className)}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-blue-600 dark:bg-blue-500 animate-pulse',
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
      case 'coaching':
        return <CoachingLoader />;
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'bars':
        return <BarsLoader />;
      case 'spinner':
      default:
        return <SpinnerLoader />;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && (
        <p className={cn(
          'text-gray-600 dark:text-gray-400 font-medium',
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
