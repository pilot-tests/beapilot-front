import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const handleLogin = async (email_user, password_user) => {
    try {
      const response = await axios.post('http://www.beapilot.local:82/users', {
        email_user,
        password_user
      },
      {
      params: {
        login: true
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Auth: "abc"
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
        setError(error.response.data.message);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setError('No response was received');
      } else {
        // Algo salió mal al configurar la solicitud
        setError('Error setting up request');
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="email" value={username} onChange={e => setUsername(e.target.value)} required />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
