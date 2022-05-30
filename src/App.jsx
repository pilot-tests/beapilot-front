import React from 'react';
import { Routes, Route } from 'react-router-dom';
import  AsignaturesList  from './components/AsignaturesList';
import  Test  from './components/Test';



	export function App() {

		return (
			<React.Fragment>
				<h1>Página App</h1>
				<Routes>
					<Route path="/" element={<AsignaturesList />} />
					<Route path="/test/:catId" element={<Test />} />
				</Routes>
			</React.Fragment>
		);
	}


