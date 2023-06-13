import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './components/PrivateRoute'; //

import  Landing  from './views/Landing';
import  Test  from './views/Test';
import  TestResult from './views/TestResult';
import  Dashboard  from './views/Dashboard';
import './style.css';


	export function App() {
		return (
			<>
				<h1>Página App</h1>
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


