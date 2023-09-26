import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PrivateRoutes from './components/PrivateRoute';
import ReactGA from 'react-ga4';
import Analytics from './components/Analytics';

import  Landing  from './views/landing/Landing';
import  Test  from './views/test/Test';
import  TestResult from './views/testResult/TestResult';
import  Dashboard  from './views/dashboard/Dashboard';

import UserArea from './views/user/UserArea';
import  Subscribe  from './views/subscribe/Subscribe';
import { RegistrationForm } from './views/register/Register';
import RegisterCancel from './views/register/RegisterCancel';
import RegisterSuccess from './views/register/RegisterSuccess';
import VerifyEmail from './views/verifyEmail/VerifyEmail';
import Contact from './views/contact/Contact';
import './Scss/style.scss';

// Inicializar Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

if (window.location.hostname !== 'localhost') {
	ReactGA.initialize('G-H482JFP07W');
}

	export function App() {

		return (
			<Elements stripe={stripePromise}>
				<Router>
					<Analytics />
					<Routes>
						<Route exact path="/" element={<Landing />} />
						<Route exact path="/logedout" element={<Landing />} />
						<Route path="/subscribe" element={<Subscribe />} />
						<Route path="/register" element={<RegistrationForm />} />
						<Route path="/exito" element={<RegistrationForm />} />
						<Route path="/verify-email" element={<VerifyEmail />} />
						<Route path="/register/success/:sessionId" element={<RegisterSuccess />} />
						<Route path="/register/cancel" element={<RegisterCancel />} />
						<Route element={<PrivateRoutes />}>
                <Route element={<Dashboard/>} path="/dashboard" />
								<Route element={<UserArea/>} path="/user" />
                <Route element={<Test/>} path="/test/:testId"/>
								<Route element={<TestResult/>} path="/testresult/:testId"/>
								<Route element={<Contact/>} path="/contact"/>
            </Route>
					</Routes>
				</Router>
			</Elements>
		);
	}


