"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ThemeShowcase = () => {
  return (
    <div className="p-8 space-y-8 bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Theme Showcase</h1>
        <p className="text-muted-foreground">Demonstrating the Coaching Kart minimalistic design</p>
      </div>

      {/* Color Palette */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Premium Blue Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch 
            color="hsl(205 100% 50%)" 
            name="Primary Blue" 
            className="bg-primary" 
          />
          <ColorSwatch 
            color="hsl(210 40% 96%)" 
            name="Secondary" 
            className="bg-secondary" 
          />
          <ColorSwatch 
            color="hsl(210 25% 94%)" 
            name="Muted" 
            className="bg-muted" 
          />
          <ColorSwatch 
            color="hsl(210 20% 98%)" 
            name="Card" 
            className="bg-card" 
          />
        </div>
      </section>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Card Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This is a basic card with clean styling.</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">Primary Themed Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This card has a blue theme accent.</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This card has enhanced shadow for emphasis.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Typography</h2>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
          <h2 className="text-3xl font-semibold text-foreground">Heading 2</h2>
          <h3 className="text-2xl font-medium text-foreground">Heading 3</h3>
          <p className="text-foreground">Regular paragraph text with good readability.</p>
          <p className="text-muted-foreground">Muted text for secondary information.</p>
          <p className="text-primary font-medium">Primary colored text for highlights.</p>
        </div>
      </section>
    </div>
  );
};

// Color Swatch Component
const ColorSwatch = ({ 
  color, 
  name, 
  className 
}: { 
  color: string; 
  name: string; 
  className: string; 
}) => {
  return (
    <div className="text-center">
      <div 
        className={`w-full h-20 rounded-lg border border-border ${className}`}
        style={{ backgroundColor: color }}
      />
      <p className="text-sm font-medium text-foreground mt-2">{name}</p>
      <p className="text-xs text-muted-foreground">{color}</p>
    </div>
  );
};

export default ThemeShowcase;
