import React from 'react';
import { Routes, Route } from 'react-router-dom';
import  AsignaturesList  from './components/AsignaturesList';
import  Test  from './components/Test';



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


