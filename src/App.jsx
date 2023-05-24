import React from 'react';
import { Routes, Route } from 'react-router-dom';
import  Landing  from './views/Landing';
import  Test  from './views/Test';
import  Dashboard  from './views/Dashboard';
import './style.css';



	export function App() {

		return (
			<>
				<h1>Página App</h1>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/test/:testId" element={<Test />} />
				</Routes>
			</>
		);
	}


