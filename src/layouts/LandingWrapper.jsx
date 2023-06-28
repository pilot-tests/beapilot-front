import React from 'react';
import Topbar from '../components/layout/Topbar';
import './Layouts.scss';

const LandingWrapper = ({ children }) => {
  return (
    <React.Fragment>
      <Topbar />
      <div className="landing-content">{children}</div>

    </React.Fragment>
  );
};

export default LandingWrapper;
