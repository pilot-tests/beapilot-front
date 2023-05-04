import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as API from "../services/getCategories"

export default function Test(props) {
	const [data, setData] = useState({ results: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const { testId } = useParams();

	const userID = 5;

	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
		const getData = async () => {
			try {

				// We make sure the test exists
				const response = await axios.get(
					`http://www.beapilot.local:82/?examId=${ testId }`
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
			<>
				<div>Página de Test</div>
				{loading && <div>A moment please...</div>}
				{error && (
					<div>{`There is a problem fetching the post data - ${error}`}</div>
				)}

				{data && data.results && (
					<div >
						<h2>{data.results[0].string_question}</h2>
						<ul>
							<li>
								{data.results[0].answer_1_string}
							</li>
							<li>
								{data.results[0].answer_2_string}
							</li>
							<li>
								{data.results[0].answer_3_string}
							</li>
							<li>
								{data.results[0].answer_4_string}
							</li>
						</ul>
					</div>
				)}
				{/* {data && data.results && (
        <pre>
          <code>{JSON.stringify(data.results, null, 2)}</code>
        </pre>
      )} */}

				{/* {data &&
					data.results.map((result) => (
						<div key={result.id_question_answer}>
							id_Questionintest: {result.id_questionintest} <br />
							id_test_questyionintest: {result.id_questionintest} <br />
							StudentAnswer: {result.studentanswer_questionintest} <br />
							id_question: {result.id_question_questionintest} <br />
							id_User: {result.id_user_questionintest} <br />
							<hr />
						</div>
					))} */}
			</>
		);
}