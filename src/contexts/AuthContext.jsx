import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setAuth({ token, user });
    }
    setLoading(false);  // Una vez cargados los datos, actualizamos el estado loading.
  }, []);

  const setToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuth(prevAuth => ({ ...prevAuth, token }));
  };

  const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuth(prevAuth => ({ ...prevAuth, user }));
  };

  const updateAuthUser = (updatedData) => {
    setAuth((prevAuth) => ({ ...prevAuth, user: { ...prevAuth.user, ...updatedData } }));
  };


  const value = {
    auth,
    setToken,
    setUser,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

