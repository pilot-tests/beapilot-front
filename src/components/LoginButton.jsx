import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function AuthButton() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  if (isAuthenticated) {
    return (
      <div>
        <img src={user.picture} alt={user.name} className='avatar' />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      </div>
    );
  } else {
    return <button onClick={() =>
        loginWithRedirect({
          redirectUri: 'http://localhost:3000/dashboard',
        })
      }>Log In</button>;
  }
}

export default AuthButton;
