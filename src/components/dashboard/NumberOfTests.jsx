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

  useEffect(() => {
		// TODO: Refactor all API calls into a function or a service
		const getData = async () => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_API_URL}relations`,
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
							Auth: "abc"
						}
					}
				);
				console.log("Number of tests request:", response.data);
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

    <table>
      <thead>
				<tr>
					<th scope="col">Categoría</th>
					<th scope="col">Fecha inicio</th>
					<th scope="col">Fecha Fin</th>
					<th scope="col">Nota</th>
				</tr>
			</thead>
			<tbody>
      {data &&
				data.results.map((result) => (
					<tr key={result.id_test}>
						<td>{result.name_category}</td>
						<td>
							<time dateTime={result.creationdate_test}>{formatDate(result.creationdate_test)}</time>
						</td>
						<td>
							<time dateTime={result.updatedate_test}>{formatDate(result.updatedate_test)}</time>
						</td>
						<td>
							{result.finished_test != 0 ?
								<span style={{'--color-bg-pill': `var(--color-score-${determineRating(result.final_note)})`}} className={`pill `}>{result.final_note}</span>
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
   );
}

export default NumberOfTests;