import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ShowcaseStyle } from '../types';

type Theme = 'light' | 'dark' | 'synthwave';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  showcaseStyle: ShowcaseStyle;
  setShowcaseStyle: (style: ShowcaseStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('app-theme');
      return (savedTheme as Theme) || 'dark';
    } catch (error) {
      return 'dark';
    }
  });

  const [showcaseStyle, setShowcaseStyle] = useState<ShowcaseStyle>(() => {
    try {
      const savedStyle = localStorage.getItem('showcase-style');
      return (savedStyle as ShowcaseStyle) || 'fluid';
    } catch (error) {
      return 'fluid';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
        localStorage.setItem('app-theme', theme);
    } catch (error) {
        console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('showcase-style', showcaseStyle);
    } catch (error) {
      console.error("Failed to save showcase style to localStorage", error);
    }
  }, [showcaseStyle]);

  const value = useMemo(() => ({ theme, setTheme, showcaseStyle, setShowcaseStyle }), [theme, showcaseStyle]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};