import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationResult {
  locationName: string;
  loading: boolean;
  errorMsg: string | null;
}

const DEFAULT_LOCATION = 'Campina Grande - PB';

export const useUserLocation = (): LocationResult => {
  const [locationName, setLocationName] = useState<string>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const reverseGeocoded = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocoded && reverseGeocoded.length > 0) {
          const { city, region } = reverseGeocoded[0];
          if (city && region) {
            setLocationName(`${city} - ${region}`);
          }
        }
      } catch (error) {
        setErrorMsg('Error fetching location');
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { locationName, loading, errorMsg };
};
