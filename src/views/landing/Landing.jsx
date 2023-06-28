import React from 'react';
import LoginForm from '../../components/LoginForm';
import LandingWrapper from '../../layouts/LandingWrapper';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
  <LandingWrapper>
    <div className="form-center">
      <LoginForm />
    </div>
  </LandingWrapper>
  );
};

export default Landing;