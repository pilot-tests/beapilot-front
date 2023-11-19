import React, { useEffect } from 'react';
import LoginForm from '../../components/LoginForm';
import { useNavigate } from "react-router-dom";
import VisitorWrapper from '../../layouts/VisitorWrapper';
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
  <VisitorWrapper>
    <div className="block-medium">
      <LoginForm />
    </div>
  </VisitorWrapper>
  );
};

export default Landing;