import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextData {
  theme: ThemeMode;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = 'theme_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);
  const deviceColorScheme = useDeviceColorScheme();
  const { setColorScheme: setNWColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      applyTheme();
    }
  }, [theme, deviceColorScheme, isLoading]);

  async function loadTheme() {
    try {
      const storedTheme = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
      if (storedTheme) {
        setThemeState(storedTheme as ThemeMode);
      }
    } catch (e) {
      console.error('Failed to load theme preference', e);
    } finally {
      setIsLoading(false);
    }
  }

  function applyTheme() {
    const activeScheme = theme === 'system' ? deviceColorScheme : theme;
    if (activeScheme) {
      setNWColorScheme(activeScheme as 'light' | 'dark');
    }
  }

  async function setTheme(newTheme: ThemeMode) {
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (e) {
      console.error('Error saving theme preference', e);
      throw e;
    }
  }

  const colorScheme = theme === 'system' ? (deviceColorScheme ?? 'light') : theme;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme: colorScheme as 'light' | 'dark', setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
