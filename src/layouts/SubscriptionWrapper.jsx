// Ideal wrapper for when the user is loged in but has no subscription.
import React from 'react';
import Topbar from '../components/layout/Topbar';


const SubscriptionWrapper = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return (
    <React.Fragment>
      <Topbar />
      <main className="container">
        {children}
      </main>
    </React.Fragment>
  );
};

export default SubscriptionWrapper;
