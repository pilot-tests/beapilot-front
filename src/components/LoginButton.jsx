import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function AuthButton() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (isAuthenticated) {
    return (
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log In</button>;
  }
}

export default AuthButton;
