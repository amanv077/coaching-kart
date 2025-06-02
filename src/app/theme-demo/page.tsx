'use client';

export default function ThemeDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            🎨 Centralized Theme System
          </h1>
          <p className="text-muted-foreground text-lg">
            Change 5 colors in src/lib/theme.ts to transform the entire project
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">Theme Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-coaching-primary rounded-lg text-center">
              <p className="text-coaching-background font-semibold">Primary Color</p>
              <p className="text-coaching-background/80 text-sm">coaching-primary</p>
            </div>
            <div className="p-4 bg-coaching-secondary rounded-lg text-center">
              <p className="text-white font-semibold">Secondary Color</p>
              <p className="text-white/80 text-sm">coaching-secondary</p>
            </div>
            <div className="p-4 bg-coaching-accent rounded-lg text-center">
              <p className="text-white font-semibold">Accent Color</p>
              <p className="text-white/80 text-sm">coaching-accent</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">Basic Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-coaching-primary text-coaching-background rounded-lg hover:bg-coaching-primary/90 transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-coaching-secondary text-white rounded-lg hover:bg-coaching-secondary/90 transition-colors">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-coaching-accent text-white rounded-lg hover:bg-coaching-accent/90 transition-colors">
              Accent Button
            </button>
            <button className="px-4 py-2 border border-coaching-border text-foreground rounded-lg hover:bg-muted transition-colors">
              Outline Button
            </button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">Text Examples</h2>
          <div className="space-y-3">
            <p className="text-coaching-primary text-lg font-semibold">Primary themed text</p>
            <p className="text-coaching-secondary text-lg font-semibold">Secondary themed text</p>
            <p className="text-coaching-accent text-lg font-semibold">Accent themed text</p>
            <p className="text-foreground">Regular foreground text</p>
            <p className="text-muted-foreground">Muted foreground text</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">How to Change Theme</h2>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              To change the entire project theme, edit the <span className="font-mono bg-muted px-2 py-1 rounded">THEME_COLORS</span> object in:
            </p>
            <p className="font-mono bg-muted px-3 py-2 rounded text-sm">
              src/lib/theme.ts
            </p>
            <div className="p-4 bg-coaching-primary/10 border border-coaching-primary/20 rounded-lg">
              <p className="text-sm">
                💡 <strong>Single Source of Truth:</strong> Change just 5 colors in one file and the entire project updates automatically!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
