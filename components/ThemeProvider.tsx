'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Time-based theme definitions
// Morning  (6:00 - 11:59)  ☀️ Warm sunlight
// Afternoon (12:00 - 17:59) 🌤 Bright café
// Night    (18:00 - 5:59)   🌙 Cozy dark coffee shop

export type ThemeName = 'morning' | 'afternoon' | 'night';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  gold: string;
  espresso: string;
  // Canvas-specific colors
  canvasBg1: string;
  canvasBg2: string;
  canvasBg3: string;
  // Ambient glow color
  ambientGlow: string;
}

interface ThemeContextType {
  theme: ThemeName;
  colors: ThemeColors;
  emoji: string;
  label: string;
}

const themeMap: Record<ThemeName, { colors: ThemeColors; emoji: string; label: string }> = {
  morning: {
    emoji: '☀️',
    label: 'Good Morning',
    colors: {
      bgPrimary: '#3D2A1E',
      bgSecondary: '#4D3828',
      border: '#7A5C48',
      textPrimary: '#FFF5E6',
      textSecondary: '#E0C8A8',
      accent: '#E8944C',
      gold: '#FFD700',
      espresso: '#2A1A10',
      canvasBg1: '#3D2A1E',
      canvasBg2: '#2A1A10',
      canvasBg3: '#1A0F08',
      ambientGlow: 'rgba(232, 148, 76, 0.12)',
    },
  },
  afternoon: {
    emoji: '🌤',
    label: 'Good Afternoon',
    colors: {
      bgPrimary: '#352218',
      bgSecondary: '#45322A',
      border: '#6E5040',
      textPrimary: '#FFF0DC',
      textSecondary: '#D4B896',
      accent: '#4F9C8F',
      gold: '#FFD700',
      espresso: '#221410',
      canvasBg1: '#30201A',
      canvasBg2: '#1E120C',
      canvasBg3: '#120A06',
      ambientGlow: 'rgba(79, 156, 143, 0.10)',
    },
  },
  night: {
    emoji: '🌙',
    label: 'Good Evening',
    colors: {
      bgPrimary: '#1A0F0A',
      bgSecondary: '#2D1810',
      border: '#5A4034',
      textPrimary: '#F5E6D3',
      textSecondary: '#C9B8A0',
      accent: '#4F9C8F',
      gold: '#FFD700',
      espresso: '#0E0805',
      canvasBg1: '#1A0F0A',
      canvasBg2: '#100906',
      canvasBg3: '#080402',
      ambientGlow: 'rgba(79, 156, 143, 0.06)',
    },
  },
};

function getThemeForHour(hour: number): ThemeName {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'night',
  colors: themeMap.night.colors,
  emoji: '🌙',
  label: 'Good Evening',
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('night');

  const applyTheme = useCallback((themeName: ThemeName) => {
    const { colors } = themeMap[themeName];
    const root = document.documentElement;

    root.style.setProperty('--coffee-bg-primary', colors.bgPrimary);
    root.style.setProperty('--coffee-bg-secondary', colors.bgSecondary);
    root.style.setProperty('--coffee-border', colors.border);
    root.style.setProperty('--coffee-text-primary', colors.textPrimary);
    root.style.setProperty('--coffee-text-secondary', colors.textSecondary);
    root.style.setProperty('--coffee-accent', colors.accent);
    root.style.setProperty('--coffee-gold', colors.gold);
    root.style.setProperty('--coffee-espresso', colors.espresso);

    // Update body background color to match theme
    document.body.style.backgroundColor = colors.espresso;
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    const detected = getThemeForHour(hour);
    setTheme(detected);
    applyTheme(detected);

    // Re-check every minute so the theme transitions naturally
    const interval = setInterval(() => {
      const currentHour = new Date().getHours();
      const current = getThemeForHour(currentHour);
      setTheme((prev) => {
        if (prev !== current) {
          applyTheme(current);
          return current;
        }
        return prev;
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, [applyTheme]);

  const value: ThemeContextType = {
    theme,
    colors: themeMap[theme].colors,
    emoji: themeMap[theme].emoji,
    label: themeMap[theme].label,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
