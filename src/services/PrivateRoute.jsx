import React, { useEffect } from "react";
import useEnhancedAuth0 from './UseEnhancedAuth0'
import { useLocation } from 'react-router-dom';



function PrivateRoute({ children, ...rest }) {
  const { userId, isAuthenticated, isLoading, loginWithRedirect } = useEnhancedAuth0();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: pathname } });
    }
  }, [isAuthenticated, isLoading, pathname, loginWithRedirect]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (userId === null) {
    return <div>Loading user...</div>;
  }

  return children;
}
export default PrivateRoute;