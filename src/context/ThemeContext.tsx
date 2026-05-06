import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  surface: string;
  isDark: boolean;
};

const lightTheme: Theme = {
  background: '#F4F6F9',
  card: '#FFFFFF',
  text: '#1A1D1E',
  textSecondary: '#6B7280',
  primary: '#4F46E5',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  isDark: false,
};

const darkTheme: Theme = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#A0A0A0',
  primary: '#818CF8',
  border: '#333333',
  surface: '#1A1A1A',
  isDark: true,
};

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
