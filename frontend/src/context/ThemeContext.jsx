// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

const COLOR_SCHEMES = {
  GREEN: 'green',      // Default AgriChain theme
  BLUE: 'blue',
  PURPLE: 'purple',
  ORANGE: 'orange'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.SYSTEM);
  const [colorScheme, setColorScheme] = useState(COLOR_SCHEMES.GREEN);
  const [isDark, setIsDark] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large
  const [animations, setAnimations] = useState(true);

  // Detect system theme preference
  const getSystemTheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Update theme classes on document
  const updateThemeClasses = useCallback((currentTheme, currentColorScheme, dark, highContrast, currentFontSize, enableAnimations) => {
    const html = document.documentElement;
    
    // Remove existing theme classes
    html.classList.remove('light', 'dark');
    html.classList.remove('theme-green', 'theme-blue', 'theme-purple', 'theme-orange');
    html.classList.remove('font-small', 'font-medium', 'font-large');
    html.classList.remove('high-contrast', 'no-animations');
    
    // Add current theme classes
    html.classList.add(dark ? 'dark' : 'light');
    html.classList.add(`theme-${currentColorScheme}`);
    html.classList.add(`font-${currentFontSize}`);
    
    if (highContrast) {
      html.classList.add('high-contrast');
    }
    
    if (!enableAnimations) {
      html.classList.add('no-animations');
    }
    
    // Update CSS custom properties
    html.style.setProperty('--theme-transition', enableAnimations ? 'all 0.3s ease' : 'none');
  }, []);

  // Change theme
  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    
    let actualTheme;
    if (newTheme === THEMES.SYSTEM) {
      actualTheme = getSystemTheme();
    } else {
      actualTheme = newTheme;
    }
    
    const dark = actualTheme === 'dark';
    setIsDark(dark);
    updateThemeClasses(newTheme, colorScheme, dark, isHighContrast, fontSize, animations);
    
    // Save to localStorage
    localStorage.setItem('agrichain-theme', newTheme);
  }, [colorScheme, isHighContrast, fontSize, animations, getSystemTheme, updateThemeClasses]);

  // Change color scheme
  const changeColorScheme = useCallback((newColorScheme) => {
    setColorScheme(newColorScheme);
    updateThemeClasses(theme, newColorScheme, isDark, isHighContrast, fontSize, animations);
    
    // Save to localStorage
    localStorage.setItem('agrichain-color-scheme', newColorScheme);
  }, [theme, isDark, isHighContrast, fontSize, animations, updateThemeClasses]);

  // Toggle high contrast
  const toggleHighContrast = useCallback(() => {
    const newHighContrast = !isHighContrast;
    setIsHighContrast(newHighContrast);
    updateThemeClasses(theme, colorScheme, isDark, newHighContrast, fontSize, animations);
    
    // Save to localStorage
    localStorage.setItem('agrichain-high-contrast', newHighContrast.toString());
  }, [isHighContrast, theme, colorScheme, isDark, fontSize, animations, updateThemeClasses]);

  // Change font size
  const changeFontSize = useCallback((newFontSize) => {
    setFontSize(newFontSize);
    updateThemeClasses(theme, colorScheme, isDark, isHighContrast, newFontSize, animations);
    
    // Save to localStorage
    localStorage.setItem('agrichain-font-size', newFontSize);
  }, [theme, colorScheme, isDark, isHighContrast, animations, updateThemeClasses]);

  // Toggle animations
  const toggleAnimations = useCallback(() => {
    const newAnimations = !animations;
    setAnimations(newAnimations);
    updateThemeClasses(theme, colorScheme, isDark, isHighContrast, fontSize, newAnimations);
    
    // Save to localStorage
    localStorage.setItem('agrichain-animations', newAnimations.toString());
  }, [animations, theme, colorScheme, isDark, isHighContrast, fontSize, updateThemeClasses]);

  // Quick theme toggles
  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? THEMES.LIGHT : THEMES.DARK;
    changeTheme(newTheme);
  }, [isDark, changeTheme]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    changeTheme(THEMES.SYSTEM);
    changeColorScheme(COLOR_SCHEMES.GREEN);
    setIsHighContrast(false);
    changeFontSize('medium');
    setAnimations(true);
    
    // Clear localStorage
    localStorage.removeItem('agrichain-theme');
    localStorage.removeItem('agrichain-color-scheme');
    localStorage.removeItem('agrichain-high-contrast');
    localStorage.removeItem('agrichain-font-size');
    localStorage.removeItem('agrichain-animations');
  }, [changeTheme, changeColorScheme, changeFontSize]);

  // Get theme-specific colors
  const getThemeColors = useCallback(() => {
    const colors = {
      [COLOR_SCHEMES.GREEN]: {
        primary: isDark ? '#10b981' : '#059669',
        primaryHover: isDark ? '#34d399' : '#047857',
        secondary: isDark ? '#6b7280' : '#4b5563',
        accent: isDark ? '#f59e0b' : '#d97706',
        background: isDark ? '#111827' : '#ffffff',
        surface: isDark ? '#1f2937' : '#f9fafb',
        text: isDark ? '#f9fafb' : '#111827',
        textSecondary: isDark ? '#d1d5db' : '#6b7280',
        border: isDark ? '#374151' : '#e5e7eb',
        success: isDark ? '#10b981' : '#059669',
        warning: isDark ? '#f59e0b' : '#d97706',
        error: isDark ? '#ef4444' : '#dc2626',
        info: isDark ? '#3b82f6' : '#2563eb'
      },
      [COLOR_SCHEMES.BLUE]: {
        primary: isDark ? '#3b82f6' : '#2563eb',
        primaryHover: isDark ? '#60a5fa' : '#1d4ed8',
        secondary: isDark ? '#6b7280' : '#4b5563',
        accent: isDark ? '#8b5cf6' : '#7c3aed',
        background: isDark ? '#111827' : '#ffffff',
        surface: isDark ? '#1f2937' : '#f9fafb',
        text: isDark ? '#f9fafb' : '#111827',
        textSecondary: isDark ? '#d1d5db' : '#6b7280',
        border: isDark ? '#374151' : '#e5e7eb',
        success: isDark ? '#10b981' : '#059669',
        warning: isDark ? '#f59e0b' : '#d97706',
        error: isDark ? '#ef4444' : '#dc2626',
        info: isDark ? '#3b82f6' : '#2563eb'
      },
      [COLOR_SCHEMES.PURPLE]: {
        primary: isDark ? '#8b5cf6' : '#7c3aed',
        primaryHover: isDark ? '#a78bfa' : '#6d28d9',
        secondary: isDark ? '#6b7280' : '#4b5563',
        accent: isDark ? '#ec4899' : '#db2777',
        background: isDark ? '#111827' : '#ffffff',
        surface: isDark ? '#1f2937' : '#f9fafb',
        text: isDark ? '#f9fafb' : '#111827',
        textSecondary: isDark ? '#d1d5db' : '#6b7280',
        border: isDark ? '#374151' : '#e5e7eb',
        success: isDark ? '#10b981' : '#059669',
        warning: isDark ? '#f59e0b' : '#d97706',
        error: isDark ? '#ef4444' : '#dc2626',
        info: isDark ? '#3b82f6' : '#2563eb'
      },
      [COLOR_SCHEMES.ORANGE]: {
        primary: isDark ? '#f97316' : '#ea580c',
        primaryHover: isDark ? '#fb923c' : '#c2410c',
        secondary: isDark ? '#6b7280' : '#4b5563',
        accent: isDark ? '#eab308' : '#ca8a04',
        background: isDark ? '#111827' : '#ffffff',
        surface: isDark ? '#1f2937' : '#f9fafb',
        text: isDark ? '#f9fafb' : '#111827',
        textSecondary: isDark ? '#d1d5db' : '#6b7280',
        border: isDark ? '#374151' : '#e5e7eb',
        success: isDark ? '#10b981' : '#059669',
        warning: isDark ? '#f59e0b' : '#d97706',
        error: isDark ? '#ef4444' : '#dc2626',
        info: isDark ? '#3b82f6' : '#2563eb'
      }
    };
    
    return colors[colorScheme] || colors[COLOR_SCHEMES.GREEN];
  }, [colorScheme, isDark]);

  // Initialize theme from localStorage and system preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('agrichain-theme');
    const savedColorScheme = localStorage.getItem('agrichain-color-scheme');
    const savedHighContrast = localStorage.getItem('agrichain-high-contrast');
    const savedFontSize = localStorage.getItem('agrichain-font-size');
    const savedAnimations = localStorage.getItem('agrichain-animations');
    
    const initialTheme = savedTheme || THEMES.SYSTEM;
    const initialColorScheme = savedColorScheme || COLOR_SCHEMES.GREEN;
    const initialHighContrast = savedHighContrast === 'true';
    const initialFontSize = savedFontSize || 'medium';
    const initialAnimations = savedAnimations !== 'false';
    
    setTheme(initialTheme);
    setColorScheme(initialColorScheme);
    setIsHighContrast(initialHighContrast);
    setFontSize(initialFontSize);
    setAnimations(initialAnimations);
    
    // Determine actual theme
    let actualTheme;
    if (initialTheme === THEMES.SYSTEM) {
      actualTheme = getSystemTheme();
    } else {
      actualTheme = initialTheme;
    }
    
    const dark = actualTheme === 'dark';
    setIsDark(dark);
    updateThemeClasses(initialTheme, initialColorScheme, dark, initialHighContrast, initialFontSize, initialAnimations);
  }, [getSystemTheme, updateThemeClasses]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === THEMES.SYSTEM) {
        const systemTheme = getSystemTheme();
        const dark = systemTheme === 'dark';
        setIsDark(dark);
        updateThemeClasses(theme, colorScheme, dark, isHighContrast, fontSize, animations);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, colorScheme, isHighContrast, fontSize, animations, getSystemTheme, updateThemeClasses]);

  const value = {
    // State
    theme,
    colorScheme,
    isDark,
    isHighContrast,
    fontSize,
    animations,
    
    // Actions
    changeTheme,
    changeColorScheme,
    toggleTheme,
    toggleHighContrast,
    changeFontSize,
    toggleAnimations,
    resetToDefaults,
    
    // Utilities
    getThemeColors,
    
    // Constants
    THEMES,
    COLOR_SCHEMES,
    
    // Computed values
    isSystemTheme: theme === THEMES.SYSTEM,
    currentColors: getThemeColors()
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};