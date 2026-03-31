import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

// Helper functions for token management
export function saveToken(token) {
  localStorage.setItem('access_token', token);
}

export function getToken() {
  return localStorage.getItem('access_token');
}

export function removeToken() {
  localStorage.removeItem('access_token');
}

export function isAuthenticated() {
  return !!getToken();
}

// Auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      getCurrentUser(token)
        .then(userData => setUser(userData))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    saveToken(token);
    getCurrentUser(token)
      .then(userData => setUser(userData))
      .catch(() => setUser(null));
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
