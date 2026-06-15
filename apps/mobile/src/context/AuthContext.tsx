import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

interface User {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  profilePhotoUrl?: string;
  bio?: string;
  preferences?: {
    interests?: string[];
    [key: string]: any;
  };
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedToken = await SecureStore.getItemAsync('token');
      const storedUser = await SecureStore.getItemAsync('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (e) {
      console.error('Failed to load auth data', e);
    } finally {
      setIsLoading(false);
    }
  }

  // Auth Guard Logic
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!token) {
      if (!inAuthGroup && !inOnboarding) {
        // Redireciona para onboarding se não estiver logado e não estiver em auth/onboarding
        router.replace('/onboarding');
      }
    } else if (token && (inAuthGroup || inOnboarding)) {
      // Se estiver logado e tentar acessar auth ou onboarding, vai para as abas
      router.replace('/(tabs)');
    }
  }, [token, segments, isLoading]);

  async function signIn(newToken: string, newUser: User) {
    try {
      await SecureStore.setItemAsync('token', newToken);
      await SecureStore.setItemAsync('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      // Redirecionamento manual após login para garantir fluxo
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Error saving session', e);
      throw e;
    }
  }

  async function signOut() {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      setToken(null);
      setUser(null);
      // Redireciona explicitamente para onboarding ao sair
      router.replace('/onboarding');
    } catch (e) {
      console.error('Error clearing session', e);
    }
  }

  async function updateUser(updatedFields: Partial<User>) {
    if (!user || !updatedFields) return;

    try {
      // Safe deep merge for preferences
      const currentPreferences = user.preferences || {};
      const newPreferences = updatedFields.preferences || {};

      const updatedUser = { 
        ...user, 
        ...updatedFields,
        preferences: {
          ...currentPreferences,
          ...newPreferences
        }
      };
      
      console.log('Saving updated user to storage');
      
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (e) {
      console.error('Error updating local user', e);
      throw e;
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
