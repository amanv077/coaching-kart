import React from 'react';

interface QuoteProps {
  text: string;
  author: string;
  role: string;
}

const Quote = ({ text, author, role }: QuoteProps) => (
  <div className="relative bg-gradient-to-r from-coaching-primary/5 to-coaching-accent/5 px-8 md:px-12 py-10 md:py-16 rounded-2xl">
    <div className="text-8xl absolute left-6 top-0 text-coaching-primary/30">"</div>
    <div className="text-8xl absolute right-6 bottom-0 text-coaching-primary/30">"</div>
    <blockquote className="relative z-10">
      <p className="text-xl md:text-2xl font-medium italic text-foreground mb-6 leading-relaxed">
        {text}
      </p>
      <footer>
        <div className="font-bold text-lg">{author}</div>
        <div className="text-coaching-primary text-sm">{role}</div>
      </footer>
    </blockquote>
  </div>
);

export default Quote;