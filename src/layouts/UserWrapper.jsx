import React from 'react';
import Topbar from '../components/layout/Topbar';

const UserWrapper = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return (
    <React.Fragment>
      <Topbar />
      {children}
    </React.Fragment>
  );
};

export default UserWrapper;
