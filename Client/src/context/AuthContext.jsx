// Import tools needed for state and context
import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use auth data anywhere
export const useAuth = () => useContext(AuthContext);

// Auth provider wraps the app
export const AuthProvider = ({ children }) => {
  // Store user and token in state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Load saved user on first render
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Register function
  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    return res.data;
  };

  // Login function
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });

    // Save token and user info
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    setToken(res.data.token);
    setUser(res.data.user);

    return res.data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  // Context values shared across the app
  const value = {
    user,
    token,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export provider
export default AuthContext;