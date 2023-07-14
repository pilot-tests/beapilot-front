import React, { useEffect } from 'react';
import LoginForm from '../../components/LoginForm';
import { useNavigate } from "react-router-dom";
import LandingWrapper from '../../layouts/LandingWrapper';
import { Link } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('authToken');

    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, []);
  return (
  <LandingWrapper>

    <div className="form-center">
      <LoginForm />
    </div>
  </LandingWrapper>
  );
};

export default Landing;