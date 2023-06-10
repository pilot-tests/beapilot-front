import React from 'react';
import LoginForm from '../components/LoginForm';

const LandingWrapper = ({ children }) => {
  return (
    <React.Fragment>
      <h1>Landing Wrapper</h1>
      <LoginForm />
            <div className="signup-content">{children}</div>

    </React.Fragment>
  );
};

export default LandingWrapper;
