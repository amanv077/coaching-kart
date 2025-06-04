"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { themeColors, themeVariants } from '@/lib/theme';

const ThemeShowcase = () => {
  return (
    <div className="p-8 space-y-8 bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Theme Showcase</h1>
        <p className="text-muted-foreground">Demonstrating the Coaching Kart color palette and components</p>
      </div>      {/* Color Palette */}
      <section className="space-y-4">        <h2 className="text-2xl font-semibold text-foreground">Premium Blue Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ColorSwatch 
            color="hsl(205 100% 50%)" 
            name="Premium Blue (Primary)" 
            className="bg-coaching-primary" 
          />
          <ColorSwatch 
            color="hsl(220 70% 45%)" 
            name="Deep Blue (Secondary)" 
            className="bg-coaching-secondary" 
          />
          <ColorSwatch 
            color="hsl(245 100% 60%)" 
            name="Rich Purple (Accent)" 
            className="bg-coaching-accent" 
          /><ColorSwatch 
            color="hsl(0 0% 5%)" 
            name="Almost Black" 
            className="bg-card dark:bg-card" 
          />
          <ColorSwatch 
            color="hsl(0 0% 100%)" 
            name="Pure White" 
            className="bg-coaching-text" 
          />
        </div>
      </section>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Button Variants</h2>        <div className="flex flex-wrap gap-4">
          <Button variant="default">Premium Blue</Button>
          <Button variant="secondary">Deep Blue</Button>
          <Button variant="accent">Rich Purple</Button>
          <Button variant="outline">Outline Blue</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="neon">Neon Glow</Button>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Card Examples</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-coaching-card">
            <h3 className="font-semibold mb-2">Default Card</h3>
            <p className="text-muted-foreground">Standard card with subtle shadow</p>
          </div>
          <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-coaching-hover">
            <h3 className="font-semibold mb-2">Enhanced Card</h3>
            <p className="text-muted-foreground">Card with enhanced shadow effect</p>
          </div>          <div className="bg-coaching-gradient text-background dark:text-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Gradient Card</h3>
            <p className="text-background/90 dark:text-white/90">Card with gradient background</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Typography</h2>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
          <h2 className="text-3xl font-semibold text-foreground">Heading 2</h2>
          <h3 className="text-2xl font-medium text-foreground">Heading 3</h3>
          <p className="text-foreground">Primary text content</p>
          <p className="text-muted-foreground">Secondary text content</p>
          <p className="text-coaching-primary">Accent text content</p>
        </div>
      </section>

      {/* Animations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Animations</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card p-6 rounded-lg border animate-fade-in">
            <h3 className="font-semibold mb-2">Fade In</h3>
            <p className="text-muted-foreground">Smooth fade in animation</p>
          </div>
          <div className="bg-card p-6 rounded-lg border animate-slide-up">
            <h3 className="font-semibold mb-2">Slide Up</h3>
            <p className="text-muted-foreground">Slide up entrance effect</p>
          </div>
          <div className="bg-card p-6 rounded-lg border animate-bounce-gentle">
            <h3 className="font-semibold mb-2">Gentle Bounce</h3>
            <p className="text-muted-foreground">Subtle bounce animation</p>
          </div>
        </div>
      </section>
    </div>
  );
};

interface ColorSwatchProps {
  color: string;
  name: string;
  className: string;
}

const ColorSwatch = ({ color, name, className }: ColorSwatchProps) => {
  return (
    <div className="text-center">
      <div className={`w-full h-20 rounded-lg ${className} mb-2`}></div>
      <p className="text-sm font-medium text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground font-mono">{color}</p>
    </div>
  );
};

export default ThemeShowcase;
