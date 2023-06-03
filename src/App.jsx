import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from "@auth0/auth0-react";

import  Landing  from './views/Landing';
import  Test  from './views/Test';
import  Dashboard  from './views/Dashboard';
import AuthHandler from './components/Authhandler';
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
        <Route exact path="/" element={<Landing />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/test/:testId" element={<ProtectedTest />} />
				<Route path="/authhandler" element={<AuthHandler />} />
      </Routes>
			</>
		);
	}


