import React from 'react';

const LandingWrapper = ({ children }) => {
  return (
    <React.Fragment>
      <h1>Landing Wrapper</h1>
            <div className="signup-content">{children}</div>
    </React.Fragment>
  );
};

export default LandingWrapper;
