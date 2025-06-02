import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  color: 'coaching-primary' | 'coaching-secondary' | 'coaching-accent';
  animationDelay?: number;
}

const FeatureCard = ({ title, description, icon, color, animationDelay = 0 }: FeatureCardProps) => {
  const colorClasses = {
    'coaching-primary': {
      border: 'border-coaching-primary/20 hover:border-coaching-primary/40',
      icon: 'bg-coaching-primary/10 text-coaching-primary',
      glow: 'hover:shadow-[0_0_20px_rgba(0,255,133,0.3)]'
    },
    'coaching-secondary': {
      border: 'border-coaching-secondary/20 hover:border-coaching-secondary/40',
      icon: 'bg-coaching-secondary/10 text-coaching-secondary',
      glow: 'hover:shadow-[0_0_20px_rgba(30,144,255,0.3)]'
    },
    'coaching-accent': {
      border: 'border-coaching-accent/20 hover:border-coaching-accent/40',
      icon: 'bg-coaching-accent/10 text-coaching-accent',
      glow: 'hover:shadow-[0_0_20px_rgba(255,0,153,0.3)]'
    },
  };

  const currentColor = colorClasses[color];

  return (
    <div 
      className={`
        bg-card p-6 md:p-8 rounded-xl border-2 
        transition-all duration-500 ease-out
        hover:scale-105 hover:-translate-y-2 
        ${currentColor.border} ${currentColor.glow}
        animate-fade-in
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${currentColor.icon} flex items-center justify-center mb-6 mx-auto transform hover:rotate-6 transition-transform duration-300`}>
        {icon || <div className="w-8 h-8 rounded-full bg-current opacity-70"></div>}
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-center">
        {title}
      </h3>
      
      <p className="text-muted-foreground text-center leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
