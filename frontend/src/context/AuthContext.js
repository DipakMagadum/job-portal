import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, fetchMe } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await fetchMe();
      setUser(data);
    } catch (e) {
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    const { data } = await loginUser({ username, password });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    await registerUser(payload);
    return login(payload.username, payload.password);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await fetchMe();
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
