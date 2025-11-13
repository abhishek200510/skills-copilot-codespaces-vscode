import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { user, accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const { user, accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    const response = await authApi.updateProfile(userData);
    setUser(response.data.user);
    return response.data.user;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
