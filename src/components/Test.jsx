import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as API from "../services/getCategories"

export default function Test(props) {
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const { testId } = useParams();

	const currentQuestion = quiz && quiz[currentQuestionIndex]

		const handleAnswerButtonClick = async (answerOption) => {
			const nextQuestionIndex = currentQuestionIndex + 1;
			setCurrentQuestionIndex(nextQuestionIndex);

			try {
				// Preparando los parámetros para la solicitud POST
				// const id_student_answer = student_answer;

				// Realizar la solicitud POST
				const response = await axios.post("http://www.beapilot.local:82/", params);

				// Manejar la respuesta de la solicitud POST (si es necesario)
				console.log(response.data);
			} catch (err) {
				// Manejar errores en la solicitud POST
				console.error(`Error al enviar la respuesta: ${err.message}`);
			}
		};



	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
			const getData = async () => {
			try {

				// We make sure the test exists
				const response = await axios.get(
					`http://www.beapilot.local:82/?examId=${ testId }`
				);
				console.log(response)
				setQuiz(response.data.results);
			} catch (err) {
				setError(err.message);
				setQuiz(null);
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



				{currentQuestion && (
					<div >
						<h2>{currentQuestion.string_question}</h2>
						<ul>
							<li>
								{currentQuestion.answer_1_string}
							</li>
							<li>
								{currentQuestion.answer_2_string}
							</li>
							<li>
								{currentQuestion.answer_3_string}
							</li>
							<li>
								{currentQuestion.answer_4_string}
							</li>
						</ul>
					</div>
				)}

				<button onClick={() => handleAnswerButtonClick()}>Next</button>

				{/* {data && results && (
        <pre>
          <code>{JSON.stringify(results, null, 2)}</code>
        </pre>
      )} */}

				{/* {data &&
					results.map((result) => (
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