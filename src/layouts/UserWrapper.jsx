import React from 'react';
import { AuthContext } from '../services/AuthContext';
import useEnhancedAuth0 from '../services/UseEnhancedAuth0';

const UserWrapper = ({ children }) => {
  const { userId } = useEnhancedAuth0();
  console.log("The User: " + userId);

  return (
    <AuthContext.Provider value={userId}>
      <h1>User Wrapper {userId}</h1>
      {children}
    </AuthContext.Provider>
  );
};

export default UserWrapper;
