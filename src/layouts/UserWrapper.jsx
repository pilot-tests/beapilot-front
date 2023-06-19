import React from 'react';
import Topbar from '../components/layout/Topbar';

const UserWrapper = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return (
    <React.Fragment>
      <Topbar />
      <main className="container">
        {children}
      </main>
    </React.Fragment>
  );
};

export default UserWrapper;
