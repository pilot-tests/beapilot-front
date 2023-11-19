import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const LogoutButton = () => {
  const { setToken, setUser } = useAuth();  // Obtén las funciones desde tu contexto de autenticación
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Limpia el token y la información del usuario en el contexto de autenticación
      setToken(null);
      setUser(null);

      // Limpia el token en localStorage
      localStorage.removeItem('authToken');

      // Redirige al usuario a /logedout
      navigate("/logedout");

    } catch (err) {
      console.error('Failed to logout: ', err);
    }
  };

  return (
    <>
      <button className='btn btn--aslink' onClick={handleLogout}>
        Logout
      </button>
      <Link
        to="/user"
        className="font-size-14">
          Preferencias
      </Link>
    </>
  );
};

export default LogoutButton;
