import React from 'react';
import { Link } from "react-router-dom";
import Topbar from '../components/layout/Topbar';
import './Layouts.scss';



const UserWrapper = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');


  return (
    <div className='sticky-footer'>
      <Topbar />
      <div className="container">
        {children}
      </div>
      <footer className="user-footer">
        <h6 className="user-footer__title">&#169; Test Pilot Pro</h6>
        - <Link
            to='/contact'>Ponte en contacto con nosotros</Link>
      </footer>
    </div>
  );
};

export default UserWrapper;
