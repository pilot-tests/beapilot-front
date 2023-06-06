import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from "@auth0/auth0-react";

import PrivateRoute from './services/PrivateRoute';
import  Landing  from './views/Landing';
import  Test  from './views/Test';
import  Dashboard  from './views/Dashboard';
import './style.css';

const ProtectedDashboard = withAuthenticationRequired(Dashboard, {
  onRedirecting: () => <div>Loading...</div>,
});

const ProtectedTest = withAuthenticationRequired(Test, {
  onRedirecting: () => <div>Loading...</div>,
});


	export function App() {

		return (
			<>
				<h1>Página App</h1>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/test/:testId"
            element={
              <PrivateRoute>
                <Test />
              </PrivateRoute>
            }
          />
        </Routes>
			</>
		);
	}


