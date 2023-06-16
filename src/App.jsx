import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './components/PrivateRoute'; //

import  Landing  from './views/landing/Landing';
import  Test  from './views/test/Test';
import  TestResult from './views/testResult/TestResult';
import  Dashboard  from './views/dashboard/Dashboard';
import './style.css';


	export function App() {
		return (
			<>
				<Router>
					<Routes>
						<Route exact path="/" element={<Landing />} />
						<Route exact path="/logedout" element={<Landing />} />
						<Route element={<PrivateRoutes />}>
                <Route element={<Dashboard/>} path="/dashboard" />
                <Route element={<Test/>} path="/test/:testId"/>
								<Route element={<TestResult/>} path="/testresult/:testId"/>
            </Route>
					</Routes>
				</Router>
			</>
		);
	}


