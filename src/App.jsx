import React, { useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PrivateRoutes from './components/PrivateRoute';
import ReactGA from 'react-ga4';

import  Landing  from './views/landing/Landing';
import  Test  from './views/test/Test';
import  TestResult from './views/testResult/TestResult';
import  Dashboard  from './views/dashboard/Dashboard';
import  Subscribe  from './views/subscribe/Subscribe';
import { RegistrationForm } from './views/register/Register';
import RegisterCancel from './views/register/RegisterCancel';
import RegisterSuccess from './views/register/RegisterSuccess';
import VerifyEmail from './views/verifyEmail/VerifyEmail';
import './Scss/style.scss';

// Inicializar Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);
ReactGA.initialize('G-H482JFP07W');

	export function App() {
		const location = useLocation();

		useEffect(() => {
			ReactGA.page_view(location.pathname + location.search);
		}, [location]);

		return (
			<Elements stripe={stripePromise}>
				<Router>
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
                <Route element={<Test/>} path="/test/:testId"/>
								<Route element={<TestResult/>} path="/testresult/:testId"/>
            </Route>
					</Routes>
				</Router>
			</Elements>
		);
	}


