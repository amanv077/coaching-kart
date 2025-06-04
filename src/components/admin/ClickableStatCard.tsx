"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClickableStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  description: string;
  href?: string;
  singular: string;
  plural: string;
}

const ClickableStatCard: React.FC<ClickableStatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description,
  href,
  singular,
  plural
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  // Format the display value with proper pluralization
  const formatDisplayValue = (count: number, singular: string, plural: string) => {
    if (count === 0) {
      return `0 ${plural}`;
    } else if (count === 1) {
      return `1 ${singular}`;
    } else {
      return `${count} ${plural}`;
    }
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-200 ${
        href ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>            <p className="text-3xl font-bold text-foreground mb-1">
              {(value ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDisplayValue(value ?? 0, singular, plural)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 opacity-80">
              {description}
            </p>
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center shrink-0`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClickableStatCard;
