import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as API from "../services/getCategories"

export default function Test(props) {
	const [data, setData] = useState({ results: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { testId } = useParams();
	const userID = 2;

	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
		const getData = async () => {
			try {
				// We make sure the test exists
				const response = await axios.get(
					`http://www.beapilot.local:82/test?linkTo=id_test,id_user_test&equalTo=${ testId }_${userID}&select=*`
				);
				if (response.status === 200) {
					const TestResponse = await axios.get(
						`http://www.beapilot.local:82/answers?linkTo=istrue_answer,id_question_answer&equalTo=1_4&select=string_answer,id_question_answer`
					);
					setData(TestResponse.data);
					console.log(TestResponse.data)
					setError(null);
				}
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
				<div>Página de Test</div>
				{loading && <div>A moment please...</div>}
				{error && (
					<div>{`There is a problem fetching the post data - ${error}`}</div>
				)}
				{data &&
					data.results.map((result) => (
						<div key={result.id_question_answer}>
							id_test: {result.string_answer} <br />

						</div>
					))}
			</>
		);
}