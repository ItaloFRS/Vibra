import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

// Mocks
jest.mock('expo-secure-store');
jest.mock('nativewind', () => ({
  useColorScheme: jest.fn(),
}));
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(),
}));

describe('ThemeContext', () => {
  const setNWColorSchemeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNativeWindColorScheme as jest.Mock).mockReturnValue({
      setColorScheme: setNWColorSchemeMock,
    });
    (useDeviceColorScheme as jest.Mock).mockReturnValue('light');
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
  });

  it('should initialize with system theme by default', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    // Wait for loading to finish
    await act(async () => {
      // Small delay to allow useEffect to run
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.theme).toBe('system');
    expect(result.current.isLoading).toBe(false);
  });

  it('should load theme from SecureStore on mount', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('dark');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should update theme and save to SecureStore', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('theme_preference', 'dark');
    expect(setNWColorSchemeMock).toHaveBeenCalledWith('dark');
  });

  it('should apply device color scheme when theme is system', async () => {
    (useDeviceColorScheme as jest.Mock).mockReturnValue('dark');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.colorScheme).toBe('dark');
    expect(setNWColorSchemeMock).toHaveBeenCalledWith('dark');
  });
});
