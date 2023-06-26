import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext'
import UserWrapper from "../../layouts/UserWrapper";
import NumberOfTests from "../../components/dashboard/NumberOfTests";
import Bar from "../../components/Bar/Bar";
import GlobalFeedback from "../../components/GlobalFeedback";
import './Dashboard.scss';

export default function AsignaturesList() {
	const [data, setData] = useState({ results: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const { auth } = useAuth();
  const token = auth.token;
  const user = auth.user;
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
				`${import.meta.env.VITE_API_URL}test`,
				serializedData,
				{
					params: {
							token: token
						},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Auth: import.meta.env.VITE_AUTH
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
					`${import.meta.env.VITE_API_URL}averageByCategory`,
					{
						params: {
							token: token,
							userId:userID
						},
						headers: {
							Auth: import.meta.env.VITE_AUTH
						}
					}
				);
				console.log("user per category info: ", response.data);
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
			{loading && <div>A moment please...</div>}
			{error && (
				<div>{`There is a problem fetching the post data - ${error}`}</div>
			)}

			<GlobalFeedback />

			<ul className="category-list">
				{data &&
					data.results.map((result) => (
						<li
							className={`category-list__item ${result.name_category}`}
							key={result.id_category}
							style={{ '--color-bg-cat': `var(--color-cat-${result.id_category})` }}>

							<h2 className="category-list__title">{result.name_category}</h2>
							<div className="category-list__body">
								<p className="category-list__rating" >{result.average_note ? result.average_note : "00.00" }</p>
							</div>
							<Bar rating={result.average_note} />
							{result.has_tests > 0 ?
								<>
									{Number(result.has_finished_tests) === 1 ?
										<>
											<button onClick={() => handleAddTest(result)} disabled={loading}>
												{loading ? 'Cargando...' : 'Hacer otro test'}
											</button>
										</>
										:
										<Link
										to={{pathname:`/test/${result.id_test}`}}
										className="link-high">
										Continuar Test
									</Link>
									}
								</>
							:
								<button onClick={() => handleAddTest(result)} disabled={loading}>
									{loading ? 'Cargando...' : 'Empezar Test'}
								</button>
							}
						</li>
					))}
			</ul>

			<div className="ui-block">
				<h2>Tus últimos tests</h2>
				<NumberOfTests />
			</div>

		</UserWrapper>
	);
}
