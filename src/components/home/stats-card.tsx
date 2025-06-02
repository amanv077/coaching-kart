import React from 'react';

interface StatsCardProps {
  number: string;
  label: string;
  icon?: React.ReactNode;
  color?: 'coaching-primary' | 'coaching-secondary' | 'coaching-accent';
}

const StatsCard = ({ number, label, icon, color = 'coaching-primary' }: StatsCardProps) => {
  const colorClasses = {
    'coaching-primary': 'text-coaching-primary',
    'coaching-secondary': 'text-coaching-secondary', 
    'coaching-accent': 'text-coaching-accent',
  };

  return (
    <div className="text-center p-6 bg-card/50 rounded-xl backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300">
      {icon && (
        <div className={`text-3xl md:text-4xl ${colorClasses[color]} mb-2`}>
          {icon}
        </div>
      )}
      <div className={`text-3xl md:text-4xl lg:text-5xl font-bold ${colorClasses[color]} mb-2`}>
        {number}
      </div>
      <div className="text-sm md:text-base text-muted-foreground font-medium">
        {label}
      </div>
    </div>
  );
};

export default StatsCard;
