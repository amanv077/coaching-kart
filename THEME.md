# 🎨 Centralized Theme System

## 🎯 **TO CHANGE COLORS: Edit `src/lib/theme.ts`**

This project uses a **centralized theme system** where the entire visual theme can be changed by editing just **5 colors** in a single file.

## 🚀 Quick Start
**To change the entire project theme, edit these 5 values in `src/lib/theme.ts`:**

```typescript
export const THEME_COLORS = {
  background: '#0D0D0D',    // Main background color
  primaryText: '#FFFFFF',   // Primary text color  
  accentGreen: '#00FF85',   // Primary accent (buttons, CTAs)
  accentBlue: '#1E90FF',    // Secondary accent
  hoverPink: '#FF0099',     // Interactive/hover effects
  // ... rest is auto-generated
}
```

**That's it!** Change these 5 colors in `src/lib/theme.ts` and the entire project updates automatically.

## 📁 **File to Edit: `src/lib/theme.ts`**
```bash
# Navigate to the theme file
src/lib/theme.ts
```
This is the **ONLY** file you need to edit to change colors project-wide.

## Demo
Visit `/theme-demo` to see the theme system in action and test color changes.

## Example Themes

### 🟢 Neon (Current)
```typescript
background: '#0D0D0D',
accentGreen: '#00FF85', 
accentBlue: '#1E90FF',
hoverPink: '#FF0099'
```

### 🟣 Purple Galaxy
```typescript
background: '#1A0B2E',
accentGreen: '#7209B7',
accentBlue: '#9D4EDD', 
hoverPink: '#E0AAFF'
```

### 🟠 Orange Fire
```typescript
background: '#0D0D0D',
accentGreen: '#FF8500',
accentBlue: '#FF6B35',
hoverPink: '#FFB627'
```

## Features
- ✅ Single source of truth for all colors
- ✅ Automatic CSS variable generation
- ✅ Tailwind class generation (`coaching-primary`, etc.)
- ✅ Component variants auto-update
- ✅ Dark/light mode support
- ✅ Neon effects and animations

## Usage in Components
Use the generated semantic classes:
```tsx
<div className="bg-coaching-primary text-coaching-background">
  <p className="text-coaching-secondary">
    Theme colors update automatically!
  </p>
</div>
```

## Architecture
1. **Central Config**: `src/lib/theme.ts` - Edit colors here
2. **Auto-generation**: Creates CSS variables and Tailwind classes
3. **Integration**: `tailwind.config.ts` imports the theme
4. **Components**: Use semantic classes that auto-update

The system ensures consistency and makes theme changes effortless across the entire application.