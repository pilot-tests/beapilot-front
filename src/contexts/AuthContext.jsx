import React, { createContext, useState, useContext } from 'react';

// Crea el Contexto
const AuthContext = createContext();

// Crea un Hook personalizado para usar el Contexto de Autenticación
export const useAuth = () => {
  return useContext(AuthContext);
}

// Crea un Proveedor de Contexto
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  const setToken = (token) => {
    setAuth(prevState => ({
      ...prevState,
      token
    }));
  }

  const setUser = (user) => {
    setAuth(prevState => ({
      ...prevState,
      user
    }));
  }

  return (
    <AuthContext.Provider value={{ auth, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
