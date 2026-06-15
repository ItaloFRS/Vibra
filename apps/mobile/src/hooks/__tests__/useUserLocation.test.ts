import { renderHook, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { useUserLocation } from '../useUserLocation';

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}));

describe('useUserLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return default location if permission is denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.locationName).toBe('Campina Grande - PB');
      expect(result.current.loading).toBe(false);
    });
  });

  it('should return localized name when permission is granted and geocoding succeeds', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
    });

    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      {
        city: 'São Paulo',
        region: 'SP',
      },
    ]);

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.locationName).toBe('São Paulo - SP');
      expect(result.current.loading).toBe(false);
    });
  });

  it('should return fallback if reverse geocoding returns empty', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: 0,
        longitude: 0,
      },
    });

    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.locationName).toBe('Campina Grande - PB');
      expect(result.current.loading).toBe(false);
    });
  });
});
