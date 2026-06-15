import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'has_seen_onboarding';

export const useOnboarding = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOnboardingStatus = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
      if (value === 'true') {
        setHasSeenOnboarding(true);
      }
    } catch (error) {
      console.error('Error loading onboarding status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOnboardingStatus();
  }, [loadOnboardingStatus]);

  const markAsSeen = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return {
    hasSeenOnboarding,
    loading,
    markAsSeen,
  };
};
