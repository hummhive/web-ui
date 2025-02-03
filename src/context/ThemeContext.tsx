import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types';

const themes: Record<string, Theme> = {
  light: {
    name: 'light',
    primary: 'bg-white',
    secondary: 'bg-stone-50',
    background: 'bg-white',
    text: 'text-stone-700'
  },
  dark: {
    name: 'dark',
    primary: 'bg-stone-950',
    secondary: 'bg-stone-900',
    background: 'bg-stone-950',
    text: 'text-stone-200'
  }
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(themes.light);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeState(themes[savedTheme]);
  }, []);

  const setTheme = (themeName: string) => {
    setThemeState(themes[themeName]);
    localStorage.setItem('theme', themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};