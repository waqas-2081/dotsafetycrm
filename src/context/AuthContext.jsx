import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem('auth_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, []);

  const login = useCallback(async (email, password, remember = false) => {
    const { data } = await api.post('/login', { email, password, remember });
    localStorage.setItem('auth_token', data.token);
    persistUser(data.user);
    setLoading(false);
    return data.user;
  }, [persistUser]);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('auth_token');
    persistUser(null);
  }, [persistUser]);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      persistUser(null);
      setLoading(false);
      return null;
    }
    try {
      const { data } = await api.get('/user');
      persistUser(data);
      return data;
    } catch {
      localStorage.removeItem('auth_token');
      persistUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  // Bootstrap auth once on mount (do not re-run when callbacks change).
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isUser: user?.role === 'user',
      login,
      logout,
      refreshUser,
      setUser: persistUser,
    }),
    [user, loading, login, logout, refreshUser, persistUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
