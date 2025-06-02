import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Users, Clock, BookOpen, Wifi, WifiOff, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoachingCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  location: {
    city: string;
    area: string;
    distance?: string;
  };
  rating: number;
  totalReviews: number;
  subjects: string[];
  exams: string[];
  modes: ('online' | 'offline')[];
  price: {
    from: number;
    to?: number;
    period: string;
  };
  features: string[];
  established?: number;
  totalStudents?: number;
  successRate?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}

const CoachingCard = ({
  id,
  name,
  description,
  image,
  location,
  rating,
  totalReviews,
  subjects,
  exams,
  modes,
  price,
  features,
  established,
  totalStudents,
  successRate,
  isVerified,
  isFeatured
}: CoachingCardProps) => {
  return (
    <div className={`group bg-card rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-coaching-primary/10 hover:-translate-y-1 ${
      isFeatured ? 'border-coaching-primary/30 shadow-md' : 'border-border'
    }`}>
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-coaching-accent text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        </div>
      )}

      <div className="relative">
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Price Badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-coaching-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              ₹{price.from.toLocaleString()}{price.to && `-${price.to.toLocaleString()}`}/{price.period}
            </div>
          </div>

          {/* Verified Badge */}
          {isVerified && (
            <div className="absolute top-3 right-3">
              <div className="bg-green-500 text-white p-1 rounded-full">
                <Award size={16} />
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="text-yellow-400 fill-current" size={14} />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-xs text-muted-foreground">({totalReviews})</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-coaching-primary" size={16} />
            <span className="text-sm text-muted-foreground">
              {location.area}, {location.city}
              {location.distance && ` • ${location.distance}`}
            </span>
          </div>

          {/* Modes */}
          <div className="flex items-center gap-2 mb-4">
            {modes.map((mode) => (
              <div key={mode} className="flex items-center gap-1 bg-coaching-secondary/10 text-coaching-secondary px-2 py-1 rounded-full text-xs">
                {mode === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
                <span className="capitalize">{mode}</span>
              </div>
            ))}
          </div>

          {/* Subjects */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Subjects:</h4>
            <div className="flex flex-wrap gap-1">
              {subjects.slice(0, 3).map((subject) => (
                <span key={subject} className="bg-coaching-primary/10 text-coaching-primary text-xs px-2 py-1 rounded">
                  {subject}
                </span>
              ))}
              {subjects.length > 3 && (
                <span className="text-xs text-muted-foreground">+{subjects.length - 3} more</span>
              )}
            </div>
          </div>

          {/* Exams */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Exam Preparation:</h4>
            <div className="flex flex-wrap gap-1">
              {exams.slice(0, 3).map((exam) => (
                <span key={exam} className="bg-coaching-accent/10 text-coaching-accent text-xs px-2 py-1 rounded">
                  {exam}
                </span>
              ))}
              {exams.length > 3 && (
                <span className="text-xs text-muted-foreground">+{exams.length - 3} more</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-b">
            {established && (
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{new Date().getFullYear() - established}+</div>
                <div className="text-xs text-muted-foreground">Years</div>
              </div>
            )}
            {totalStudents && (
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{totalStudents}+</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
            )}
            {successRate && (
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{successRate}%</div>
                <div className="text-xs text-muted-foreground">Success</div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {features.slice(0, 3).map((feature) => (
                <div key={feature} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-coaching-primary rounded-full"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/coaching/${id}`}>
                View Details
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingCard;