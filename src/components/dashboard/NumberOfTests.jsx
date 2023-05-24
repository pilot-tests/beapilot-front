import React, { useEffect, useState } from "react";
import axios from "axios";


function NumberOfTests() {


  const [data, setData] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userID = 6;
  useEffect(() => {
		// TODO: Refactor all API calls into a function or a service
		const getData = async () => {
			try {
				const response = await axios.get(
					`http://www.beapilot.local:82/relations?rel=test,categories&type=id_category_test,id_category&select=*&linkTo=id_user_test,finished_test&equalTo=${userID}_1`
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
    <ul>
      <h3>Resultados Exámentes:</h3>
      {data &&
					data.results.map((result) => (
						<li key={result.id_test}>
              {result.name_category}:
							{result.final_note}
						</li>
					))}
    </ul>
   );
}

export default NumberOfTests;