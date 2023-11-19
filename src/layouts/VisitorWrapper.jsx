// Ideal wrapper for when the user is loged in but has no subscription.
import React from 'react';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';


const VisitorWrapper = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return (
    <div className='sticky-footer'>
      <Topbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default VisitorWrapper;
