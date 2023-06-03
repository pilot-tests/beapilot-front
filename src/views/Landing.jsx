import React from 'react';
import LandingWrapper from '../layouts/LandingWrapper';
import { Link } from 'react-router-dom';

import LoginButton from '../components/LoginButton'

const Landing = () => {
  return (
  <LandingWrapper>
    Landing Component <Link to="/dashboard">Accede al Dashboard</Link>
    <LoginButton />
  </LandingWrapper>
  );
};

export default Landing;