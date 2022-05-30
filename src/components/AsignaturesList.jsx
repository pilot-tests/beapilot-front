import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as API from "../services/getCategories";

export default function AsignaturesList() {
	const [categories, setCategories] = useState({ results: [] });
	useEffect(() => {
		API.getAllCategories().then(setCategories).catch(console.log);
	}, [])

	return (
		<React.Fragment>
			<h2>Página de Asignaturas</h2>
			<ul>
				{categories.results.map((result) => (
					<li key={result.id_category}>
						<Link to={"/test/" + result.id_category}>
							{result.name_category}
						</Link>
					</li>
				))}
			</ul>
		</React.Fragment>
	);
}
