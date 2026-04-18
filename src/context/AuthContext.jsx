import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('rachnova_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rachnova_token');
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setAdmin(res.data.admin);
          localStorage.setItem('rachnova_admin', JSON.stringify(res.data.admin));
        })
        .catch(() => {
          localStorage.removeItem('rachnova_token');
          localStorage.removeItem('rachnova_admin');
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, admin: adminData } = res.data;
    localStorage.setItem('rachnova_token', token);
    localStorage.setItem('rachnova_admin', JSON.stringify(adminData));
    setAdmin(adminData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('rachnova_token');
    localStorage.removeItem('rachnova_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
