import React from 'react';
import { Routes, Route } from 'react-router-dom';
import  AsignaturesList  from './views/AsignaturesList';
import  Test  from './views/Test';
import './style.css';



	export function App() {

		return (
			<>
				<h1>Página App</h1>
				<Routes>
					<Route path="/" element={<AsignaturesList />} />
					<Route path="/test/:testId" element={<Test />} />
				</Routes>
			</>
		);
	}


