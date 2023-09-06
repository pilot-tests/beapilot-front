import React from 'react';
import Topbar from '../components/layout/Topbar';

const UserWrapper = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return (
    <div className='sticky-footer'>
      <Topbar />
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export default UserWrapper;
