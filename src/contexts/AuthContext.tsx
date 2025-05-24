import { spotifyApi } from '../services/spotifyApi';
import type { SpotifyUser } from '../services/spotifyApi';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: SpotifyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  handleCallback: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (spotifyApi.isAuthenticated()) {
        try {
          const userData = await spotifyApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user data:', error);
          spotifyApi.logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
    // No-op change to trigger Vite cache invalidation
  }, []);

  const login = () => {
    window.location.href = spotifyApi.getAuthUrl();
  };

  const logout = () => {
    spotifyApi.logout();
    setUser(null);
  };

  const handleCallback = async (code: string) => {
    try {
      setIsLoading(true);
      await spotifyApi.exchangeCodeForToken(code);
      const userData = await spotifyApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    handleCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};