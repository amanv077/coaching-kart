import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/image-utils';

interface StoryNodeProps {
  year: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  isLeft?: boolean;
}

const StoryNode = ({ 
  year, 
  title, 
  description, 
  image, 
  icon, 
  isLeft = true 
}: StoryNodeProps) => (
  <div className="relative">
    {/* Timeline node */}
    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-coaching-primary to-coaching-accent flex items-center justify-center text-white shadow-xl">
      {icon}
    </div>
    
    <div className={`grid md:grid-cols-5 gap-6 md:gap-12 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
      {/* Year indicator - always visible */}
      <div className="md:col-span-5 text-center">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-coaching-primary/20 to-coaching-accent/20 rounded-full text-sm font-medium">
          {year}
        </div>
      </div>
      
      {/* Content and image */}
      <div className={`md:col-span-2 ${isLeft ? 'md:order-1' : 'md:order-2'}`}>
        <div className="aspect-video relative overflow-hidden rounded-2xl shadow-xl">
          <Image 
            src={getImageUrl(image)} 
            alt={title}
            className="object-cover hover:scale-105 transition-transform duration-500"
            fill
          />
        </div>
      </div>
      
      <div className={`md:col-span-3 flex items-center ${isLeft ? 'md:order-2' : 'md:order-1'}`}>
        <div className={`bg-card/80 backdrop-filter backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-coaching-primary/10 shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${isLeft ? 'md:ml-4' : 'md:mr-4'}`}>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-coaching-gradient bg-clip-text  ">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default StoryNode;