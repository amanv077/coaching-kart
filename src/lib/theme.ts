// 🎨 CENTRALIZED THEME CONFIGURATION
// Change colors here to update the entire project instantly!

export const THEME_COLORS = {
  // === CORE THEME COLORS (Edit these 5 values to change entire project theme) ===
  background: '#000000',      // Pure black background for maximum contrast
  primaryText: '#FFFFFF',     // Pure white text
  accentGreen: '#00FF88',     // Electric neon green (primary/buttons/CTA)
  accentBlue: '#0099FF',      // Brilliant blue (secondary accent)
  hoverPink: '#FF0088',       // Hot pink (hover/interactive effects)    // Extended palette for UI consistency
  cardBackground: '#0D0D0D',  // Subtle dark card background
  border: '#333333',          // Bright borders for visibility
  muted: '#4A4A4A',           // Brighter muted elements
  mutedText: '#E0E0E0',       // Very light muted text for readability
  
  // Light mode overrides (automatically generated from dark colors)
  light: {
    background: '#FFFFFF',
    primaryText: '#0D0D0D',
    cardBackground: '#F8F9FA',
    border: '#E2E8F0',
    muted: '#F1F5F9',
    mutedText: '#64748B',
  }
} as const;

// Centralized theme generator - creates all variations from base colors
export const generateThemeConfig = () => {
  const colors = THEME_COLORS;
  
  return {
    // CSS Custom Properties mapping
    cssVariables: {
      dark: {
        '--background': colors.background,
        '--foreground': colors.primaryText,
        '--primary': colors.accentGreen,
        '--primary-foreground': colors.background,
        '--secondary': colors.cardBackground,
        '--secondary-foreground': colors.primaryText,
        '--accent': colors.accentBlue,
        '--accent-foreground': colors.primaryText,
        '--muted': colors.cardBackground,
        '--muted-foreground': colors.mutedText,
        '--card': colors.cardBackground,
        '--card-foreground': colors.primaryText,
        '--border': colors.border,
        '--destructive': '#EF4444',
        '--destructive-foreground': colors.primaryText,
        '--ring': colors.accentGreen,
      },
      light: {
        '--background': colors.light.background,
        '--foreground': colors.light.primaryText,
        '--primary': colors.accentGreen,
        '--primary-foreground': colors.background,
        '--secondary': colors.light.muted,
        '--secondary-foreground': colors.light.primaryText,
        '--accent': colors.accentBlue,
        '--accent-foreground': colors.light.background,
        '--muted': colors.light.muted,
        '--muted-foreground': colors.light.mutedText,
        '--card': colors.light.cardBackground,
        '--card-foreground': colors.light.primaryText,
        '--border': colors.light.border,
        '--destructive': '#EF4444',
        '--destructive-foreground': colors.light.background,
        '--ring': colors.accentGreen,
      }
    },
    
    // Tailwind color mappings
    tailwindColors: {
      'coaching-bg': colors.background,
      'coaching-text': colors.primaryText,
      'coaching-primary': colors.accentGreen,
      'coaching-secondary': colors.accentBlue,
      'coaching-accent': colors.hoverPink,
      'coaching-hover': colors.hoverPink,
      'coaching-card': colors.cardBackground,
      'coaching-border': colors.border,
      'coaching-muted': colors.muted,
    }
  };
};

// Legacy exports for backward compatibility
export const themeColors = {
  background: THEME_COLORS.background,
  primaryText: THEME_COLORS.primaryText,
  accentCyan: THEME_COLORS.accentBlue,     // Mapped for compatibility
  accentPink: THEME_COLORS.hoverPink,      // Mapped for compatibility  
  button: THEME_COLORS.accentGreen,        // Mapped for compatibility
} as const;

// Semantic theme configuration using centralized colors
export const themeConfig = {
  colors: {
    coaching: {
      background: THEME_COLORS.background,
      text: THEME_COLORS.primaryText,
      primary: THEME_COLORS.accentGreen,
      secondary: THEME_COLORS.accentBlue,
      accent: THEME_COLORS.hoverPink,
      hover: THEME_COLORS.hoverPink,
      card: THEME_COLORS.cardBackground,
      border: THEME_COLORS.border,
      muted: THEME_COLORS.muted,
    },
  },
  gradients: {
    primary: `linear-gradient(135deg, ${THEME_COLORS.accentGreen} 0%, ${THEME_COLORS.accentBlue} 100%)`,
    secondary: `linear-gradient(135deg, ${THEME_COLORS.accentBlue} 0%, ${THEME_COLORS.accentGreen} 100%)`,
    accent: `linear-gradient(135deg, ${THEME_COLORS.hoverPink} 0%, ${THEME_COLORS.accentGreen} 100%)`,
    neon: `linear-gradient(135deg, ${THEME_COLORS.accentGreen} 0%, ${THEME_COLORS.accentBlue} 50%, ${THEME_COLORS.hoverPink} 100%)`,
  },
  shadows: {
    card: `0 4px 6px -1px rgba(0, 255, 133, 0.1), 0 2px 4px -1px rgba(0, 255, 133, 0.06)`,
    button: `0 4px 14px 0 rgba(0, 255, 133, 0.25)`,
    hover: `0 10px 25px -3px rgba(0, 255, 133, 0.2), 0 4px 6px -2px rgba(0, 255, 133, 0.1)`,
    neon: `0 0 20px rgba(0, 255, 133, 0.5), 0 0 40px rgba(0, 255, 133, 0.3)`,
    blue: `0 0 20px rgba(30, 144, 255, 0.5), 0 0 40px rgba(30, 144, 255, 0.3)`,
    pink: `0 0 20px rgba(255, 0, 153, 0.5), 0 0 40px rgba(255, 0, 153, 0.3)`,
  },
};

// Utility functions for theme management
export const getThemeColor = (colorKey: keyof typeof THEME_COLORS) => {
  return THEME_COLORS[colorKey];
};

export const createGradient = (color1: string, color2: string, direction = '135deg') => {
  return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
};

export const createShadow = (color: string, opacity = 0.5, blur = 20) => {
  return `0 0 ${blur}px rgba(${color}, ${opacity})`;
};

// Component variant helpers
export const buttonVariants = {
  default: {
    background: THEME_COLORS.accentGreen,
    color: THEME_COLORS.background,
    hover: THEME_COLORS.hoverPink,
  },
  secondary: {
    background: THEME_COLORS.accentBlue,
    color: THEME_COLORS.primaryText,
    hover: THEME_COLORS.accentGreen,
  },
  accent: {
    background: THEME_COLORS.hoverPink,
    color: THEME_COLORS.primaryText,
    hover: THEME_COLORS.accentGreen,
  },
  outline: {
    background: 'transparent',
    color: THEME_COLORS.accentGreen,
    border: THEME_COLORS.accentGreen,
    hover: THEME_COLORS.accentGreen,
  },
  ghost: {
    background: 'transparent',
    color: THEME_COLORS.primaryText,
    hover: THEME_COLORS.cardBackground,
  },
};

// Animation configurations using theme colors
export const animations = {
  neonPulse: {
    from: { boxShadow: `0 0 20px ${THEME_COLORS.accentGreen}` },
    to: { boxShadow: `0 0 30px ${THEME_COLORS.accentGreen}, 0 0 40px ${THEME_COLORS.accentGreen}` },
  },
  glow: {
    from: { filter: 'brightness(1)' },
    to: { filter: 'brightness(1.2) drop-shadow(0 0 10px currentColor)' },
  },
};

// Utility function to get theme-aware classes
export const getThemeClasses = () => ({
  // Background classes
  background: 'bg-theme-background dark:bg-theme-background',
  cardBackground: 'bg-card dark:bg-card',
  
  // Text classes
  primaryText: 'text-foreground dark:text-theme-text',
  secondaryText: 'text-muted-foreground',
  
  // Button classes
  primaryButton: 'bg-coaching-primary hover:bg-coaching-primary/90 text-white shadow-coaching-button',
  secondaryButton: 'bg-coaching-secondary hover:bg-coaching-secondary/90 text-coaching-background',
  accentButton: 'bg-coaching-accent hover:bg-coaching-accent/90 text-coaching-background',
  
  // Card classes
  card: 'bg-card text-card-foreground shadow-coaching-card rounded-lg border',
  
  // Input classes
  input: 'bg-input border-border text-foreground placeholder:text-muted-foreground',
  
  // Gradient backgrounds
  gradientPrimary: 'bg-coaching-gradient',
  gradientSecondary: 'bg-coaching-gradient-reverse',
  gradientAccent: 'bg-coaching-accent-gradient',
});

// Theme variants for different UI states
export const themeVariants = {
  button: {
    primary: 'bg-coaching-primary hover:bg-coaching-primary/90 text-coaching-background shadow-coaching-button transition-all duration-200 hover:shadow-coaching-hover hover:shadow-neon',
    secondary: 'bg-coaching-secondary hover:bg-coaching-secondary/90 text-white transition-all duration-200 hover:shadow-blue',
    accent: 'bg-coaching-accent hover:bg-coaching-accent/90 text-white transition-all duration-200 hover:shadow-pink',
    outline: 'border-2 border-coaching-primary text-coaching-primary hover:bg-coaching-primary hover:text-coaching-background transition-all duration-200 hover:shadow-neon',
    ghost: 'text-coaching-primary hover:bg-coaching-primary/10 transition-all duration-200 hover:shadow-neon',
    neon: 'bg-coaching-gradient text-white shadow-coaching-button hover:shadow-neon transition-all duration-300',
  },
  card: {
    default: 'bg-card text-card-foreground shadow-coaching-card rounded-lg border border-border hover:shadow-coaching-hover transition-all duration-200',
    elevated: 'bg-card text-card-foreground shadow-coaching-hover rounded-lg border border-border hover:shadow-neon transition-all duration-300',
    gradient: 'bg-coaching-gradient text-white rounded-lg border-0 shadow-neon',
    neon: 'bg-card text-card-foreground shadow-neon rounded-lg border-2 border-coaching-primary/20',
  },
  text: {
    heading: 'text-foreground font-bold tracking-tight',
    body: 'text-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-coaching-primary',
    neon: 'text-coaching-primary drop-shadow-[0_0_10px_rgba(0,255,133,0.5)]',
  },
} as const;

// Animation classes
export const themeAnimations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  bounceGentle: 'animate-bounce-gentle',
  neonPulse: 'animate-neon-pulse',
  glow: 'animate-glow',
} as const;

// Responsive breakpoints aligned with Tailwind
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
