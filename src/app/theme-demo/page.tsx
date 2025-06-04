'use client';

export default function ThemeDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground text-glow-premium">
            ⚡ VIBRANT DARK THEME ⚡
          </h1>
          <p className="text-muted-foreground text-xl">
            Pure black background with electric neon accents
          </p>
          <div className="flex justify-center gap-4">
            <div className="w-4 h-4 bg-coaching-primary rounded-full animate-glow-pulse"></div>
            <div className="w-4 h-4 bg-coaching-secondary rounded-full animate-blue-glow"></div>
            <div className="w-4 h-4 bg-coaching-accent rounded-full animate-glow-pulse"></div>
          </div>
        </div>        <div className="bg-card p-8 rounded-xl border border-coaching-border space-y-6 card-vibrant">
          <h2 className="text-3xl font-bold text-card-foreground text-glow-premium">
            Premium Color Palette
          </h2>          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">            <div className="p-6 bg-coaching-primary rounded-xl text-center hover-lift">              <div className="text-4xl mb-2">⚡</div>
              <p className="text-black dark:text-white font-bold text-lg">
                #0099FF
              </p>
              <p className="text-black/80 dark:text-white/80 text-sm">
                Premium Blue
              </p>
            </div>            <div className="p-6 bg-coaching-secondary rounded-xl text-center hover-lift">
              <div className="text-4xl mb-2">💫</div>
              <p className="text-black dark:text-white font-bold text-lg">#0099FF</p>
              <p className="text-black/80 dark:text-white/80 text-sm">Brilliant Blue</p>
            </div>            <div className="p-6 bg-coaching-accent rounded-xl text-center hover-lift">
              <div className="text-4xl mb-2">🔥</div>
              <p className="text-black dark:text-white font-bold text-lg">#FF0088</p>
              <p className="text-black/80 dark:text-white/80 text-sm">Hot Pink</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-8 rounded-xl border border-coaching-border space-y-6 card-vibrant">
          <h2 className="text-3xl font-bold text-card-foreground text-glow-blue">
            Interactive Elements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Vibrant Buttons
              </h3>              <div className="space-y-3">                <button className="w-full px-6 py-3 bg-coaching-primary text-black dark:text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 hover-glow">
                  ⚡ Primary Action
                </button>
                <button className="w-full px-6 py-3 bg-coaching-secondary text-black dark:text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 hover-blue-glow">
                  💫 Secondary Action
                </button>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-coaching-primary to-coaching-secondary text-black dark:text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 animate-rainbow">
                  🌈 Gradient Action
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Animated Cards
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-coaching-card-bg border border-coaching-border rounded-xl hover-lift animate-scale-in">
                  <p className="text-foreground">Hover to lift</p>
                </div>
                <div className="p-4 bg-coaching-card-bg border border-coaching-border rounded-xl animate-float">
                  <p className="text-foreground">Floating animation</p>
                </div>
                <div className="p-4 bg-coaching-card-bg border border-coaching-primary/30 rounded-xl animate-glow-pulse">
                  <p className="text-foreground">Glowing border</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">
            Text Examples
          </h2>
          <div className="space-y-3">
            <p className="text-coaching-primary text-lg font-semibold">
              Primary themed text
            </p>
            <p className="text-coaching-secondary text-lg font-semibold">
              Secondary themed text
            </p>
            <p className="text-coaching-accent text-lg font-semibold">
              Accent themed text
            </p>
            <p className="text-foreground">Regular foreground text</p>
            <p className="text-muted-foreground">Muted foreground text</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">
            How to Change Theme
          </h2>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              To change the entire project theme, edit the{' '}
              <span className="font-mono bg-muted px-2 py-1 rounded">
                THEME_COLORS
              </span>{' '}
              object in:
            </p>
            <p className="font-mono bg-muted px-3 py-2 rounded text-sm">
              src/lib/theme.ts
            </p>
            <div className="p-4 bg-coaching-primary/10 border border-coaching-primary/20 rounded-lg">
              <p className="text-sm">
                💡 <strong>Single Source of Truth:</strong> Change just 5 colors
                in one file and the entire project updates automatically!
              </p>
            </div>
          </div>
        </div>        <div className="bg-card p-8 rounded-xl border border-coaching-border space-y-6 card-vibrant">
          <h2 className="text-3xl font-bold text-card-foreground text-glow-premium">
            🚀 Theme Transformation Complete!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                ✨ What Changed:
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-coaching-primary rounded-full"></span>
                  Pure black background (#000000) for maximum contrast
                </li>                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-coaching-primary rounded-full"></span>
                  Premium blue (#0099FF) primary accent
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-coaching-secondary rounded-full"></span>
                  Deep blue (#0040CC) secondary accent
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Hot pink (#FF0088) hover effects
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Enhanced contrast for better readability
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                🎨 Theme Features:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-coaching-primary/10 border border-coaching-primary/30 rounded-lg text-center">
                  <div className="text-coaching-primary font-bold">Glow Effects</div>
                </div>
                <div className="p-3 bg-coaching-secondary/10 border border-coaching-secondary/30 rounded-lg text-center">
                  <div className="text-coaching-secondary font-bold">Animations</div>
                </div>
                <div className="p-3 bg-coaching-accent/10 border border-coaching-accent/30 rounded-lg text-center">
                  <div className="text-coaching-accent font-bold">Hover States</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-coaching-primary/10 to-coaching-secondary/10 border border-coaching-primary/30 rounded-lg text-center">
                  <div className="text-foreground font-bold">Gradients</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center pt-6">
            <p className="text-muted-foreground text-lg mb-4">
              🎯 Edit colors in{' '}
              <code className="bg-coaching-primary/20 text-coaching-primary px-2 py-1 rounded">
                src/lib/theme.ts
              </code>{' '}
              to customize further
            </p>            <div className="flex flex-wrap justify-center gap-4">              <span className="px-4 py-2 bg-coaching-primary text-black dark:text-white rounded-full font-semibold animate-glow-pulse">
                Electric
              </span>
              <span className="px-4 py-2 bg-coaching-secondary text-black dark:text-white rounded-full font-semibold animate-blue-glow">
                Vibrant
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-coaching-primary to-coaching-accent text-black dark:text-black rounded-full font-semibold animate-rainbow">
                Dynamic
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
