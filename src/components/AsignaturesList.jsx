import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import * as API from "../services/getCategories";

export default function AsignaturesList() {
	const [data, setData] = useState({ results: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);


	const userID = 2;

	//TODO: Refactor all AXIOS calls into a function component?
	//TODO: define an ID
	useEffect(() => {
		// TODO: Refactor this into a function
		const getData = async () => {
			try {
				const response = await axios.get(
					`http://www.beapilot.local:82/?userID=${userID}`
				);
				console.log(response.data);
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
		<>
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
							{result.name_category}
							{result.id_user_test > 0 ?
							<Link

							to={{
								pathname:`/test/${result.id_test}`}}>
								{result.name_category}
							</Link>
							: " Start one"
							}
						</li>
					))}
			</ul>
		</>
	);
}
