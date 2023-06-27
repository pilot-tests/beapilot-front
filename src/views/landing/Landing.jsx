import React from 'react';
import LoginForm from '../../components/LoginForm';
import LandingWrapper from '../../layouts/LandingWrapper';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
  <LandingWrapper>

    Landing Component <Link to="/dashboard">Accede al Dashboard</Link>
    <LoginForm />
  </LandingWrapper>
  );
};

export default Landing;