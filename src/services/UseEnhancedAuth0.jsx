import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import axios from 'axios';

const useEnhancedAuth0 = () => {
  const {
    isAuthenticated,
    user,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently
  } = useAuth0();
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const verifyOrCreateUser = async () => {
        setLoadingUser(true);
        try {
          const response = await axios.post('http://www.beapilot.local:82/checkUser', {
            authId: user.sub,
            authEmail: user.email
            }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          console.log('verifyOrCreateUser response: ', response);
        setUserId(response.data.results);
        console.log('After setUserId: ', userId);
        setLoadingUser(false);

        } catch (error) {
          console.error("Catch: Error verificando o creando el usuario", error);
        }
      };

      verifyOrCreateUser();
    }
  }, [isAuthenticated, getAccessTokenSilently, isLoading]);

  return console.log(userId)
  // {
  //   isAuthenticated,
  //   user,
  //   isLoading,
  //   loginWithRedirect,
  //   getAccessTokenSilently,
  //   userId
  // };
};

export default useEnhancedAuth0;
