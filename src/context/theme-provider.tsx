"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Add this script to prevent flash
function ThemeScript({ defaultTheme, storageKey }: { defaultTheme: Theme; storageKey: string }) {
  // This script runs on the client before React hydration
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function getThemePreference() {
              var theme = localStorage.getItem('${storageKey}');
              if (!theme) return '${defaultTheme}';
              return theme;
            }
            
            var theme = getThemePreference();
            var resolvedTheme = theme;
            
            if (theme === 'system') {
              resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(resolvedTheme);
            document.documentElement.style.colorScheme = resolvedTheme;
          })();
        `,
      }}
    />
  );
}

export function ThemeProvider({ 
  children,
  defaultTheme = 'dark',  // Changed default to 'dark' to avoid flash
  storageKey = 'coaching-kart-theme'
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark'); // Default to dark

  useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    let resolved: 'light' | 'dark';
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      resolved = systemTheme;
    } else {
      resolved = theme;
    }
    
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
    setResolvedTheme(resolved);
    
    // Store theme preference
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <>
      <ThemeScript defaultTheme={defaultTheme} storageKey={storageKey} />
      <ThemeContext.Provider 
        value={{ 
          theme, 
          setTheme: handleSetTheme, 
          resolvedTheme 
        }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
