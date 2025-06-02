module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'next/core-web-vitals', // This is essential for Next.js projects
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  rules: {
    // Turn off rules causing common errors
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js with JSX transform
    'react/no-unescaped-entities': 'off', // Ignores issues with quotes and apostrophes
    '@typescript-eslint/no-unused-vars': 'warn', // Only warn for unused variables
    '@typescript-eslint/no-explicit-any': 'warn', // Only warn for explicit any types
    
    // Additional rules set to warning
    'react/jsx-key': 'warn',
    'react/jsx-no-target-blank': 'warn',
    'react/jsx-no-undef': 'warn',
    'react/no-children-prop': 'warn',
    'react/no-unknown-property': 'warn',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
  },
};