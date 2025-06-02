import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    languageOptions: { 
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
    }
  },
  {
    settings: {
      react: {
        version: "detect" // Detect React version to fix the warning
      }
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      // Turn off rules causing common errors
      "react/react-in-jsx-scope": "off",     // Not needed in Next.js with JSX transform
      "react/no-unescaped-entities": "off",  // Ignores issues with quotes and apostrophes
      
      // Only warn for TypeScript issues
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Other rules set to warning
      "react/jsx-key": "warn",
      "react/jsx-no-target-blank": "warn",
      "react/jsx-no-undef": "warn",
      "react/no-children-prop": "warn",
      "react/no-unknown-property": "warn",
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      
      // Additional helpful warnings
      "no-console": "warn",
      "no-debugger": "warn",
    }
  }
]);
