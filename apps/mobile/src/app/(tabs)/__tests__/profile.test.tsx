import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../profile';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useQuery } from '@tanstack/react-query';

// Mocks
jest.mock('../../../context/AuthContext');
jest.mock('../../../context/ThemeContext');
jest.mock('@tanstack/react-query');
jest.mock('expo-image', () => ({
  Image: () => null,
}));
jest.mock('../../../services/media', () => ({
  mediaService: {
    pickImage: jest.fn(),
    uploadImage: jest.fn(),
  },
}));
jest.mock('../../../services/profile', () => ({
  profileService: {
    updateProfile: jest.fn(),
  },
}));
jest.mock('../../../services/social', () => ({
  socialService: {
    getMatchCount: jest.fn(),
  },
}));

describe('ProfileScreen', () => {
  const setThemeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        fullName: 'Test User',
        bio: 'Test Bio',
        preferences: { interests: [] },
      },
      signOut: jest.fn(),
      updateUser: jest.fn(),
    });
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      setTheme: setThemeMock,
    });
    (useQuery as jest.Mock).mockReturnValue({
      data: 0,
    });
  });

  it('should render theme selection options', () => {
    const { getByText } = render(<ProfileScreen />);
    
    expect(getByText('Tema')).toBeTruthy();
    expect(getByText('Claro')).toBeTruthy();
    expect(getByText('Escuro')).toBeTruthy();
    expect(getByText('Sistema')).toBeTruthy();
  });

  it('should call setTheme when a theme option is pressed', () => {
    const { getByText } = render(<ProfileScreen />);
    
    fireEvent.press(getByText('Escuro'));
    expect(setThemeMock).toHaveBeenCalledWith('dark');

    fireEvent.press(getByText('Claro'));
    expect(setThemeMock).toHaveBeenCalledWith('light');

    fireEvent.press(getByText('Sistema'));
    expect(setThemeMock).toHaveBeenCalledWith('system');
  });
});
