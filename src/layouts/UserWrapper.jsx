import React from 'react';

const UserWrapper = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return (
    <React.Fragment>
      <h1>User Wrapper</h1>
      {children}
    </React.Fragment>
  );
};

export default UserWrapper;
