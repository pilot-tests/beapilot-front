import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import axios from 'axios';

function useEnhancedAuth0() {
  const {
    isAuthenticated,
    user,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const verifyOrCreateUser = async () => {
      if (isAuthenticated && user) {
        // Obtén el token de acceso
        const token = await getAccessTokenSilently();

        // Usa axios para hacer la llamada al endpoint
        try {
          const params = new URLSearchParams();
            params.append('authId', user.sub);
            params.append('authEmail', user.email);
          const response = await axios.get('http://www.beapilot.local:82/', params);

          setUserId(response.data.userId);
          console.log("la Respuesta: " + response);
        } catch (error) {
          console.error("Error verificando o creando el usuario", error);
        }
      }
    };

    verifyOrCreateUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return {
    ...useAuth0(),
    userId,
    enhancedLoginWithRedirect: (options) => loginWithRedirect({
      ...options,
      appState: { returnTo: options.returnTo },
    }),
  };
}
