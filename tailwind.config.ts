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
          foreground: "hsl(var(--card-foreground))",
        },        
        // 🎨 CENTRALIZED NEON THEME COLORS - Change THEME_COLORS in src/lib/theme.ts to update everywhere!
        ...themeConfig.tailwindColors,
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
        },
        neonPulse: {
          "0%, 100%": { 
            boxShadow: `0 0 20px ${THEME_COLORS.accentGreen}40, 0 0 40px ${THEME_COLORS.accentGreen}20` 
          },
          "50%": { 
            boxShadow: `0 0 30px ${THEME_COLORS.accentGreen}60, 0 0 60px ${THEME_COLORS.accentGreen}30` 
          },
        },
        glow: {
          "0%": { 
            textShadow: `0 0 10px ${THEME_COLORS.accentGreen}80` 
          },
          "100%": { 
            textShadow: `0 0 20px ${THEME_COLORS.accentGreen}FF, 0 0 30px ${THEME_COLORS.accentGreen}80` 
          },
        },
      },
      boxShadow: {
        "coaching-card": `0 4px 6px -1px ${THEME_COLORS.accentGreen}1A, 0 2px 4px -1px ${THEME_COLORS.accentGreen}0F`,
        "coaching-button": `0 4px 14px 0 ${THEME_COLORS.accentGreen}40`,
        "coaching-hover": `0 10px 25px -3px ${THEME_COLORS.accentGreen}33, 0 4px 6px -2px ${THEME_COLORS.accentGreen}1A`,
        "neon": `0 0 20px ${THEME_COLORS.accentGreen}80, 0 0 40px ${THEME_COLORS.accentGreen}4D`,
        "blue": `0 0 20px ${THEME_COLORS.accentBlue}80, 0 0 40px ${THEME_COLORS.accentBlue}4D`,
        "pink": `0 0 20px ${THEME_COLORS.hoverPink}80, 0 0 40px ${THEME_COLORS.hoverPink}4D`,
      },
      backgroundImage: {
        "coaching-gradient": `linear-gradient(135deg, ${THEME_COLORS.accentGreen} 0%, ${THEME_COLORS.accentBlue} 100%)`,
        "coaching-gradient-reverse": `linear-gradient(135deg, ${THEME_COLORS.accentBlue} 0%, ${THEME_COLORS.accentGreen} 100%)`,
        "coaching-accent-gradient": `linear-gradient(135deg, ${THEME_COLORS.hoverPink} 0%, ${THEME_COLORS.accentGreen} 100%)`,
        "neon-gradient": `linear-gradient(135deg, ${THEME_COLORS.accentGreen} 0%, ${THEME_COLORS.accentBlue} 50%, ${THEME_COLORS.hoverPink} 100%)`,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
