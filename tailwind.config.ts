import type { Config } from "tailwindcss";
import { THEME_COLORS, generateThemeConfig } from "./src/lib/theme";

// Generate theme configuration from centralized colors
const themeConfig = generateThemeConfig();

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],  theme: {
    extend: {
      colors: {
        // Standard shadcn/ui colors (use CSS variables for theme switching)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",        },          // 🎨 COACHING THEME COLORS - Theme-aware colors using CSS variables
        'coaching-background': 'hsl(var(--background))',
        'coaching-foreground': 'hsl(var(--foreground))',        'coaching-primary': 'hsl(205 100% 50%)', // #0099FF - Premium blue as primary
        'coaching-secondary': 'hsl(220 100% 45%)', // Darker blue for secondary
        'coaching-accent': 'hsl(245 100% 60%)', // Rich purple for accent
        'coaching-hover': 'hsl(326 100% 50%)', // #FF0088
        'coaching-card': 'hsl(var(--card))',
        'coaching-border': 'hsl(var(--border))',
        'coaching-muted': 'hsl(var(--muted))',
        
        // Legacy color mappings (for backward compatibility)
        'coaching-bg': 'hsl(0 0% 0%)', // #000000
        'coaching-text': 'hsl(0 0% 100%)', // #FFFFFF
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "neon-pulse": "neonPulse 2s infinite",
        "glow": "glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },        neonPulse: {
          "0%, 100%": { 
            boxShadow: `0 0 20px hsl(205 100% 50% / 0.25), 0 0 40px hsl(205 100% 50% / 0.12)`
          },
          "50%": { 
            boxShadow: `0 0 30px hsl(205 100% 50% / 0.38), 0 0 60px hsl(205 100% 50% / 0.19)` 
          },
        },
        glow: {
          "0%": { 
            textShadow: `0 0 10px hsl(205 100% 50% / 0.5)` 
          },
          "100%": { 
            textShadow: `0 0 20px hsl(205 100% 50% / 1.0), 0 0 30px hsl(205 100% 50% / 0.5)` 
          },
        },
      },      boxShadow: {
        "coaching-card": `0 4px 6px -1px hsl(205 100% 50% / 0.1), 0 2px 4px -1px hsl(205 100% 50% / 0.06)`,
        "coaching-button": `0 4px 14px 0 hsl(205 100% 50% / 0.25)`,
        "coaching-hover": `0 10px 25px -3px hsl(205 100% 50% / 0.2), 0 4px 6px -2px hsl(205 100% 50% / 0.1)`,
        "neon": `0 0 20px hsl(205 100% 50% / 0.5), 0 0 40px hsl(205 100% 50% / 0.3)`,
        "blue": `0 0 20px hsl(205 100% 50% / 0.5), 0 0 40px hsl(205 100% 50% / 0.3)`,
        "pink": `0 0 20px hsl(326 100% 50% / 0.5), 0 0 40px hsl(326 100% 50% / 0.3)`,
      },      backgroundImage: {
        "coaching-gradient": `linear-gradient(135deg, hsl(205 100% 50%) 0%, hsl(220 100% 45%) 100%)`,
        "coaching-gradient-reverse": `linear-gradient(135deg, hsl(220 100% 45%) 0%, hsl(205 100% 50%) 100%)`,
        "coaching-accent-gradient": `linear-gradient(135deg, hsl(245 100% 60%) 0%, hsl(205 100% 50%) 100%)`,
        "neon-gradient": `linear-gradient(135deg, hsl(205 100% 50%) 0%, hsl(220 100% 40%) 50%, hsl(245 100% 60%) 100%)`,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
