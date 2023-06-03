import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';

export default function AuthHandler() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log("isAuthenticated: " + isAuthenticated);
  console.log("user: " + user);
  console.log("isLoading: " + isLoading);
  const navigate = useNavigate();

  useEffect(() => {


    const createUserIfNotExist = async (user) => {
      // Aquí podrías verificar en tu base de datos si el usuario ya existe
      // usando el ID o el correo electrónico de Auth0.
      // Si el usuario no existe, entonces puedes crear uno nuevo en tu base de datos.
      try {
        const params = new URLSearchParams();
        params.append('id_auth0', user.sub);
        params.append('email_user', user.email);

        // Supongamos que tienes una API que te permite crear un nuevo usuario si no existe.
        const response = await axios.post("http://your-api-url/users", params);

        console.log(params);

        // Aquí podrías manejar la respuesta de tu API.
        // Por ejemplo, podrías verificar si el usuario fue creado correctamente.

      } catch (err) {
        // Aquí podrías manejar cualquier error que ocurra al crear el usuario.
        console.error(err);
      }
      if (!user) {
        console.log('El usuario no está definido');
        return;
      }
    };
    if (!isLoading && isAuthenticated && user) {
      createUserIfNotExist(user);
      // navigate('/dashboard');
    }
  }, [user, isAuthenticated, isLoading, navigate]);
  return (
    <div>Autenticando...
    {user && (
        <>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </>
      )}
      </div>
  );
};
