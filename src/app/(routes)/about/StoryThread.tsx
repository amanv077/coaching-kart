import React from 'react';

interface StoryThreadProps {
  children: React.ReactNode;
}

const StoryThread = ({ children }: StoryThreadProps) => (
  <div className="relative pt-16 pb-32">
    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-coaching-primary via-coaching-secondary to-coaching-accent"></div>
    <div className="relative z-10 space-y-32">
      {children}
    </div>
  </div>
);

export default StoryThread;