import React from 'react';

const UserWrapper = ({ children }) => {
  return (
    <React.Fragment>
      <h1>User Wrapper</h1>
      {children}
    </React.Fragment>
  );
};

export default UserWrapper;
