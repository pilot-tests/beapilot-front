import React from 'react';
import Topbar from '../components/layout/Topbar';

const LandingWrapper = ({ children }) => {
  return (
    <React.Fragment>
      <Topbar />
      <h1>Landing Wrapper</h1>
      <h2>Bienvenido y todas esas cosas.</h2>
            <div className="signup-content">{children}</div>

    </React.Fragment>
  );
};

export default LandingWrapper;
