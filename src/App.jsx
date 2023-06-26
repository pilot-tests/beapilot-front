import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PrivateRoutes from './components/PrivateRoute';

import  Landing  from './views/landing/Landing';
import  Test  from './views/test/Test';
import  TestResult from './views/testResult/TestResult';
import  Dashboard  from './views/dashboard/Dashboard';
import  Subscribe  from './views/subscribe/Subscribe';
import { RegistrationForm } from './views/register/Register';
import RegisterSuccess from './views/register/RegisterSuccess';
import RegisterCancel from './views/register/RegisterCancel';
import './Scss/style.scss';

// Inicializar Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

	export function App() {
		return (
			<Elements stripe={stripePromise}>
				<Router>
					<Routes>
						<Route exact path="/" element={<Landing />} />
						<Route exact path="/logedout" element={<Landing />} />
						<Route path="/subscribe" element={<Subscribe />} />
						<Route path="/register" element={<RegistrationForm />} />
						<Route path="/register/success/:sessionId" element={<RegisterSuccess />} />
						<Route path="/register/cancel" element={<RegisterCancel />} />
						<Route element={<PrivateRoutes />}>
                <Route element={<Dashboard/>} path="/dashboard" />
                <Route element={<Test/>} path="/test/:testId"/>
								<Route element={<TestResult/>} path="/testresult/:testId"/>
            </Route>
					</Routes>
				</Router>
			</Elements>
		);
	}


