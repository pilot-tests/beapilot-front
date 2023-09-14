import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext'
import { determineRating } from "../DetermineRating";


function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function NumberOfTests() {
	const { auth } = useAuth();
  const token = auth.token;
  const user = auth.user;
	const userID = auth.user.id_user;


  const [data, setData] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
	const [limit, setLimit] = useState(10);

	const handleShowMore = () => {
			setLimit(prevLimit => prevLimit + 10); // Aumentar el límite en 10 cada vez que se haga clic en "Mostrar más"
	};

  useEffect(() => {
		// TODO: Refactor all API calls into a function or a service
		const getData = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}relations`,
					{
						params: {
							rel: "test,categories",
							type: "id_category_test,id_category",
							select: "*",
							linkTo: "id_user_test",
							equalTo: userID,
							token: token
						},
						headers: {
							Auth: import.meta.env.VITE_AUTH
						}
					}
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
		<div className="ui-block">
			<h2>Tus últimos tests</h2>
			{(!data || !data.results) &&
				<h4>No has hecho ningún test aún, elige una categoría y empieza a prepararte!</h4>
			}
			<table>
				<thead>
					<tr>
						<th scope="col">Categoría</th>
						<th scope="col">Fecha</th>
						<th scope="col">Nota</th>
					</tr>
				</thead>
				<tbody>
				{data &&
					data.results.slice(0, limit).map((result) => (
						<tr key={result.id_test}>
							<td>
									<Link
									to={{pathname:`/test/${result.id_test}`}}>
										{result.name_category}
									</Link>
							</td>
							<td>
								<Link
									to={{pathname:`/test/${result.id_test}`}}>
									<time dateTime={result.updatedate_test}>{formatDate(result.updatedate_test)}</time>
								</Link>
							</td>
							<td>
								{result.finished_test != 0 ?
									<Link
									to={{pathname:`/test/${result.id_test}`}}>
										<span style={{'--color-bg-pill': `var(--color-score-${determineRating(result.final_note)})`}} className={`pill `}>{result.final_note}</span>
									</Link>
								:
								<Link
									to={{pathname:`/test/${result.id_test}`}}
									className="link-high">
									Test en Progreso
								</Link>
								}
							</td>
						</tr>
					)
				)}
				</tbody>
			</table>
			{data && data.results.length > limit && (
				<button onClick={handleShowMore}>Mostrar más</button>
			)}
		</div>
   );
}

export default NumberOfTests;