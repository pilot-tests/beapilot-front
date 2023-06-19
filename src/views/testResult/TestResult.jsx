import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import UserWrapper from "../../layouts/UserWrapper";
import { useAuth } from '../../contexts/AuthContext'


export default function Test({test}) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { auth } = useAuth();

	const { testId } = useParams();
  const token = auth.token;
  const user = auth.user;
	const userID = auth.user.id_user;
	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
			const getData = async () => {
			try {

				// We make sure the test exists
				const response = await axios.get("http://www.beapilot.local:82/relations", {
					headers: {
						Auth: "abc"
					},
					params: {
						rel: 'test,openai',
						type: 'id_test,id_test_openai',
						select: '*',
						linkTo: 'id_test,finished_test',
						equalTo: `${testId},1`,
						token: token
					}
				});

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
			<UserWrapper>
				{loading && <div>A moment please...</div>}
				{error && (
					<div>{`There is a problem fetching the post data - ${error}`}</div>
				)}
				<h1>Test Result {testId}</h1>
				{ data &&
					<>
						<h2>Nota Final: { data && data.results[0].final_note}</h2>
						<h3>Consejos</h3>
						<div dangerouslySetInnerHTML={{ __html: data.results[0].response_openai }} />


					</>
				}


					<hr />

				<p>
					<Link to="/dashboard">Volver al Dashboard</Link>
				</p>
			</UserWrapper>
		);
}