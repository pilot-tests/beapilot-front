import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, user: null });

  // Carga el token y los datos del usuario desde el localStorage al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setAuth({ token, user });
    }
  }, []);

  const setToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuth(prevAuth => ({ ...prevAuth, token }));
  };

  const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuth(prevAuth => ({ ...prevAuth, user }));
  };

  const value = {
    auth,
    setToken,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
