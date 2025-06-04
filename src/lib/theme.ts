// 🎨 CENTRALIZED THEME CONFIGURATION
// Change colors here to update the entire project instantly!

export const THEME_COLORS = {
  // === CORE THEME COLORS (Edit these 5 values to change entire project theme) ===
  background: 'hsl(0 0% 0%)',        // #000000 - Pure black background for maximum contrast
  primaryText: 'hsl(0 0% 100%)',     // #FFFFFF - Pure white text
  accentBlue: 'hsl(205 100% 50%)',   // #0099FF - Premium blue (primary color)
  accentDarkBlue: 'hsl(220 100% 45%)', // Deeper blue (secondary accent)
  accentPurple: 'hsl(245 100% 60%)',   // Rich purple (accent/interactive effects)
  
  // Extended palette for UI consistency
  cardBackground: 'hsl(0 0% 5%)',    // #0D0D0D - Subtle dark card background
  border: 'hsl(0 0% 20%)',           // #333333 - Bright borders for visibility
  muted: 'hsl(0 0% 29%)',            // #4A4A4A - Brighter muted elements
  mutedText: 'hsl(0 0% 88%)',        // #E0E0E0 - Very light muted text for readability
  
  // Light mode overrides (automatically generated from dark colors)
  light: {
    background: 'hsl(0 0% 100%)',     // #FFFFFF - Pure white background
    primaryText: 'hsl(0 0% 5%)',      // #0D0D0D - Near black text
    cardBackground: 'hsl(210 20% 98%)', // #F8F9FA - Light card background
    border: 'hsl(214 32% 91%)',       // #E2E8F0 - Light border color
    muted: 'hsl(210 40% 96%)',        // #F1F5F9 - Light muted background
    mutedText: 'hsl(214 32% 47%)',    // #64748B - Muted text for light theme
  }
} as const;

// Centralized theme generator - creates all variations from base colors
export const generateThemeConfig = () => {
  const colors = THEME_COLORS;
  return {
    // CSS Custom Properties mapping
    cssVariables: {      dark: {
        '--background': '0 0% 0%',         // hsl value
        '--foreground': '0 0% 100%',       // hsl value
        '--primary': '205 100% 50%',       // Premium blue - hsl value
        '--primary-foreground': '0 0% 100%',  // hsl value
        '--secondary': '220 70% 45%',      // Deeper blue - hsl value
        '--secondary-foreground': '0 0% 100%', // hsl value
        '--accent': '245 100% 60%',        // Rich purple - hsl value
        '--accent-foreground': '0 0% 100%', // hsl value
        '--muted': '0 0% 5%',              // hsl value
        '--muted-foreground': '0 0% 88%',  // hsl value
        '--card': '0 0% 5%',               // hsl value
        '--card-foreground': '0 0% 100%',  // hsl value
        '--border': '0 0% 20%',            // hsl value
        '--destructive': '0 84% 60%',      // hsl value for #EF4444
        '--destructive-foreground': '0 0% 100%', // hsl value
        '--ring': '205 100% 50%',          // hsl value for premium blue
      },      light: {
        '--background': '0 0% 100%',       // hsl value
        '--foreground': '222 47% 11%',     // Darker text for better visibility
        '--primary': '205 100% 50%',       // Premium blue primary
        '--primary-foreground': '0 0% 100%',  // hsl value
        '--secondary': '220 70% 45%',      // Deeper blue secondary
        '--secondary-foreground': '0 0% 100%', // hsl value
        '--accent': '245 100% 60%',        // Rich purple accent
        '--accent-foreground': '0 0% 100%', // hsl value
        '--muted': '210 40% 96%',          // hsl value
        '--muted-foreground': '214 32% 47%', // hsl value
        '--card': '210 20% 98%',           // hsl value
        '--card-foreground': '0 0% 5%',    // hsl value
        '--border': '214 32% 91%',         // hsl value
        '--destructive': '0 84% 60%',      // hsl value for #EF4444
        '--destructive-foreground': '0 0% 100%', // hsl value
        '--ring': '205 100% 50%',          // hsl value for premium blue
      }
    },    // Tailwind color mappings - theme-aware using CSS variables
    tailwindColors: {
      // Background colors (theme-aware through CSS variables)
      'coaching-background': 'hsl(var(--background))',
      'coaching-foreground': 'hsl(var(--foreground))',
      
      // Legacy mappings for backward compatibility
      'coaching-bg': colors.background,
      'coaching-text': colors.primaryText,
        // Primary colors (work in both themes)
      'coaching-primary': colors.accentBlue,
      'coaching-secondary': colors.accentDarkBlue,
      'coaching-accent': colors.accentPurple,
      'coaching-hover': colors.accentPurple,
      
      // Card and surface colors (theme-aware)
      'coaching-card': 'hsl(var(--card))',
      'coaching-border': 'hsl(var(--border))',
      'coaching-muted': 'hsl(var(--muted))',
    }
  };
};

// Legacy exports for backward compatibility
export const themeColors = {
  background: THEME_COLORS.background,
  primaryText: THEME_COLORS.primaryText,
  accentCyan: THEME_COLORS.accentBlue,     // Mapped for compatibility
  accentPink: THEME_COLORS.accentPurple,   // Mapped for compatibility  
  button: THEME_COLORS.accentBlue,         // Mapped for compatibility
} as const;

// Semantic theme configuration using centralized colors
export const themeConfig = {
  colors: {
    coaching: {
      background: THEME_COLORS.background,
      text: THEME_COLORS.primaryText,
      primary: THEME_COLORS.accentBlue,
      secondary: THEME_COLORS.accentDarkBlue,
      accent: THEME_COLORS.accentPurple,
      hover: THEME_COLORS.accentPurple,
      card: THEME_COLORS.cardBackground,
      border: THEME_COLORS.border,
      muted: THEME_COLORS.muted,
    },
  },gradients: {
    primary: `linear-gradient(135deg, hsl(205 100% 50%) 0%, hsl(220 70% 45%) 100%)`,
    secondary: `linear-gradient(135deg, hsl(220 70% 45%) 0%, hsl(205 100% 50%) 100%)`,
    accent: `linear-gradient(135deg, hsl(245 100% 60%) 0%, hsl(205 100% 50%) 100%)`,
    neon: `linear-gradient(135deg, hsl(205 100% 50%) 0%, hsl(220 70% 45%) 50%, hsl(245 100% 60%) 100%)`,
  },  shadows: {
    card: `0 4px 6px -1px hsl(205 100% 50% / 0.1), 0 2px 4px -1px hsl(205 100% 50% / 0.06)`,
    button: `0 4px 14px 0 hsl(205 100% 50% / 0.25)`,
    hover: `0 10px 25px -3px hsl(205 100% 50% / 0.2), 0 4px 6px -2px hsl(205 100% 50% / 0.1)`,
    neon: `0 0 20px hsl(205 100% 50% / 0.5), 0 0 40px hsl(205 100% 50% / 0.3)`,
    blue: `0 0 20px hsl(205 100% 50% / 0.5), 0 0 40px hsl(205 100% 50% / 0.3)`,
    pink: `0 0 20px hsl(326 100% 50% / 0.5), 0 0 40px hsl(326 100% 50% / 0.3)`,
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
  return `0 0 ${blur}px hsl(${color} / ${opacity})`;
};

// Component variant helpers
export const buttonVariants = {
  default: {
    background: THEME_COLORS.accentBlue,
    color: 'hsl(0 0% 100%)', // Always white for better visibility
    hover: THEME_COLORS.accentPurple,
  },
  secondary: {
    background: THEME_COLORS.accentDarkBlue,
    color: 'hsl(0 0% 100%)', // Always white for better visibility
    hover: THEME_COLORS.accentBlue,
  },
  accent: {
    background: THEME_COLORS.accentPurple,
    color: 'hsl(0 0% 100%)', // Always white for better visibility
    hover: THEME_COLORS.accentBlue,
  },
  outline: {
    background: 'transparent',
    color: THEME_COLORS.accentBlue,
    border: THEME_COLORS.accentBlue,
    hover: THEME_COLORS.accentBlue,
  },
  ghost: {
    background: 'transparent',
    color: THEME_COLORS.accentBlue,
    hover: THEME_COLORS.cardBackground,
  },
};

// Animation configurations using theme colors
export const animations = {
  neonPulse: {
    from: { boxShadow: `0 0 20px ${THEME_COLORS.accentBlue}` },
    to: { boxShadow: `0 0 30px ${THEME_COLORS.accentBlue}, 0 0 40px ${THEME_COLORS.accentBlue}` },
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
  secondaryButton: 'bg-coaching-secondary hover:bg-coaching-secondary/90 text-white',
  accentButton: 'bg-coaching-accent hover:bg-coaching-accent/90 text-white',
  
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
export const themeVariants = {  button: {
    primary: 'bg-coaching-secondary hover:bg-coaching-secondary/90 text-white shadow-blue transition-all duration-200 hover:shadow-blue hover:translate-y-[-2px]',
    secondary: 'bg-coaching-primary hover:bg-coaching-primary/90 text-white transition-all duration-200 hover:shadow-neon hover:translate-y-[-2px]',
    accent: 'bg-coaching-accent hover:bg-coaching-accent/90 text-white transition-all duration-200 hover:shadow-pink hover:translate-y-[-2px]',
    outline: 'border-2 border-coaching-secondary text-coaching-secondary hover:bg-coaching-secondary hover:text-white transition-all duration-200 hover:shadow-blue hover:translate-y-[-2px]',
    ghost: 'text-coaching-secondary hover:bg-coaching-secondary/10 transition-all duration-200 hover:shadow-blue',
    neon: 'bg-coaching-gradient text-white shadow-blue hover:shadow-blue transition-all duration-300 hover:translate-y-[-2px]',
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
