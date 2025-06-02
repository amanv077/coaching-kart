import React from 'react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard = ({ icon, title, description }: ValueCardProps) => (
  <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-coaching-primary/10 hover:border-coaching-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-coaching-primary/5 hover:-translate-y-1 h-full">
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-coaching-primary/20 to-coaching-accent/20 flex items-center justify-center text-coaching-primary mb-6 text-2xl">
      {icon}
    </div>
    <h3 className="text-xl md:text-2xl font-bold mb-4">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default ValueCard;