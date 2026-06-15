import { renderHook, waitFor, act } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { useOnboarding } from '../useOnboarding';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('useOnboarding', () => {
  const ONBOARDING_KEY = 'has_seen_onboarding';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with hasSeenOnboarding as false and loading as true', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.hasSeenOnboarding).toBe(false);
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should load hasSeenOnboarding from SecureStore', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('true');

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.hasSeenOnboarding).toBe(true);
      expect(result.current.loading).toBe(false);
    });

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith(ONBOARDING_KEY);
  });

  it('should set hasSeenOnboarding to true and save it to SecureStore', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.markAsSeen();
    });

    expect(result.current.hasSeenOnboarding).toBe(true);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(ONBOARDING_KEY, 'true');
  });

  it('should handle errors when loading from SecureStore', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.hasSeenOnboarding).toBe(false);
    });
  });
});
