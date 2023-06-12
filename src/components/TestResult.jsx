import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useAuth } from '../contexts/AuthContext'


export default function Test({test}) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
		const { auth } = useAuth();
  const token = auth.token;
  const user = auth.user;
	const userID = auth.user.id_user;
	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
			const getData = async () => {
			try {

				// We make sure the test exists
				const response = await axios.get(
					`http://www.beapilot.local:82/test?linkTo=id_test&equalTo=${test}&token=${token}`,
					{
					headers: {
						'Auth': 'abc'
					}
				}
				);
				setData(response.data);
				console.log(response.data);
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
				{loading && <div>A moment please...</div>}
				{error && (
					<div>{`There is a problem fetching the post data - ${error}`}</div>
				)}
        <h1>Test Result {test}</h1>
				{data && <p>{JSON.stringify(data)}</p>} {/* Aquí mostramos los datos recibidos */}
				{data && <p>Nota Final: {data.results[0].final_note}</p>}
				<p>
					<Link to="/dashboard">Volver al Dashboard</Link>
				</p>
			</>
		);
}