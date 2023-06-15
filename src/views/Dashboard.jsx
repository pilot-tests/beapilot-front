import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import UserWrapper from "../layouts/UserWrapper";
import NumberOfTests from "../components/dashboard/NumberOfTests";

export default function AsignaturesList() {
	const [data, setData] = useState({ results: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const { auth } = useAuth();
  const token = auth.token;
  const user = auth.user;
	console.log(user);
	const userID = auth.user.id_user;


	const handleAddTest = async (result) => {
    setLoading(true);

    try {
      const postTestData = {
				id_category_test: result.id_category,
				id_user_test: userID,
				id_category_question: result.id_category,
				newTest: true
			};
			const serializedData = new URLSearchParams(postTestData).toString();

			const response = await axios.post(
				'http://www.beapilot.local:82/test',
				serializedData,
				{
					params: {
							token: token
						},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Auth: "abc"
					}
				}
			);
      if (response.status === 200) {
        navigate(`/test/${response.data.results}`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
	//TODO: Refactor all AXIOS calls into a function component?
	//TODO: define an ID
	useEffect(() => {
		// TODO: Refactor all API calls into a function or a service
		const getData = async () => {
			try {
				const response = await axios.get(
					`http://www.beapilot.local:82/?userID=${userID}`,
					{
						params: {
							token: token
						},
						headers: {
							Auth: "abc"
						}
					}
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
		<UserWrapper>

			<h2>Página de Asignaturas</h2>
			<h1>API Posts</h1>
			{loading && <div>A moment please...</div>}
			{error && (
				<div>{`There is a problem fetching the post data - ${error}`}</div>
			)}
			<NumberOfTests />
			<hr />
			<ul>
				{data &&
					data.results.map((result) => (
						<li key={result.id_category}>
							{result.name_category} -
							{result.id_user_test > 0 ?
								<>
									{Number(result.finished_test) === 1 ?
										<>
										Test Finalizado, tu score es:
											<b> {result.final_note}</b>
											<button onClick={() => handleAddTest(result)} disabled={loading}>
												{loading ? 'Cargando...' : 'Crear test de nuevo'}
											</button>
										</>
										:
										<Link
										to={{pathname:`/test/${result.id_test}`}}>
										Continuar Test
									</Link>
									}
								</>
							:
								<button onClick={() => handleAddTest(result)} disabled={loading}>
									{loading ? 'Cargando...' : 'Crear Test'}
								</button>
							}
						</li>
					))}
			</ul>
		</UserWrapper>
	);
}
