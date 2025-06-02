import React from 'react';

interface MetricCardProps {
  value: string;
  label: string;
}

const MetricCard = ({ value, label }: MetricCardProps) => (
  <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-coaching-primary/10">
    <div className="text-4xl md:text-5xl font-bold bg-coaching-gradient bg-clip-text text-transparent mb-2">
      {value}
    </div>
    <div className="text-sm text-muted-foreground uppercase tracking-wider">
      {label}
    </div>
  </div>
);

export default MetricCard;