import React, { useEffect, useState } from "react";
import axios from "axios";
import * as API from "../services/getCategories";

export default function AsignaturesList() {
	const [data, setData] = useState({ results: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);


	useEffect(() => {
		const getData = async () => {
			try {
				const response = await axios.get(
					`http://www.beapilot.local:82/categories`
				);
				setData(response.data);
				setError(null);
			} catch (err) {
				setError(err.message);
				setData(null);
			} finally {
				setLoading(false);
			}
		};
		getData();
	}, []);
	return (
		<React.Fragment>
			<h2>Página de Asignaturas</h2>
			<h1>API Posts</h1>
			{loading && <div>A moment please...</div>}
			{error && (
				<div>{`There is a problem fetching the post data - ${error}`}</div>
			)}
			<ul>
				{data &&
					data.results.map((result) => (
						<li key={result.id_category}>
							<h3>{result.name_category}</h3>
						</li>
					))}
			</ul>
		</React.Fragment>
	);
}
