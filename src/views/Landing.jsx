import React from 'react';
import LandingWrapper from '../layouts/LandingWrapper';
import { Link } from 'react-router-dom';

import LoginButton from '../components/LoginButton'

const PrivacyPolicy = () => {
  return (
  <LandingWrapper>
    Landing Component <Link to="/Dashboard">Accede al Dashboard</Link>
    <LoginButton />
  </LandingWrapper>
  );
};

export default PrivacyPolicy;