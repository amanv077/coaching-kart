import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
}

const TestimonialCard = ({ quote, author, role, avatar, rating = 5 }: TestimonialCardProps) => {
  return (
    <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Rating Stars */}
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="text-center mb-6">
        <p className="text-muted-foreground italic leading-relaxed">
          "{quote}"
        </p>
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center justify-center space-x-4">
        <div className="w-12 h-12 bg-coaching-gradient rounded-full flex items-center justify-center text-white font-bold text-lg">
          {avatar || author.charAt(0)}
        </div>
        <div className="text-center">
          <div className="font-semibold text-foreground">{author}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
