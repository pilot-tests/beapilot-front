import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loader from "./loader/Loader"
import { useAuth } from '../contexts/AuthContext'

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const handleLogin = async (email_user, password_user) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}users`, {
          email_user,
          password_user
        },
        {
        params: {
          login: true
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Auth: import.meta.env.VITE_AUTH
        }
      });

      // Obtén el token del objeto de respuesta
      const token = response.data.results[0].token_user;
      // Obtén la información del usuario del objeto de respuesta
      const user = response.data.results[0];

      console.log('Setting auth token and user...', { token, user });
      // Asigna el token a localStorage
      localStorage.setItem('authToken', token);


      // Actualiza el token y la información del usuario en el contexto de autenticación
      setToken(token);
      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un estado fuera del rango 2xx
        setLoading(false);
        setError(error.response.data.results);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setLoading(false);
        setError('No response was received');
      } else {
        // Algo salió mal al configurar la solicitud
        setLoading(false);
        setError('Error setting up request');
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(username, password);
  };

  return (
    <>
      {loading && <Loader />}
      <h1 className="title-page">Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="email" value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <div className="align-right">
          {error && <div className="alert alert--danger margin-bottom">{error}</div>}
          <button className='btn btn--cta margin-bottom' type="submit">Login</button>
          <p>No tienes cuenta? <a href="/register">Únete -></a></p>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
