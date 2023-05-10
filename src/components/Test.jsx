import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as API from "../services/getCategories"

export default function Test(props) {
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [optionSelected, setOptionSelected] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
	const { testId } = useParams();
	const userID = 5;


	const currentQuestion = quiz && quiz[currentQuestionIndex]

	const handleAnswerButtonClick = async () => {

		console.log("Opción seleccionada:", optionSelected);
		setOptionSelected(null);

		try {
			const params = new URLSearchParams();
			params.append('id_user_student_answer', userID);
			params.append('id_answer_student_answer', optionSelected);
			params.append('id_question_student_answer', currentQuestion.id_question);
			params.append('id_test_student_answer', testId);

			// Realizar la solicitud POST
			const response = await axios.post("http://www.beapilot.local:82/student_answers", params);

			const nextQuestionIndex = currentQuestionIndex + 1;
			setCurrentQuestionIndex(nextQuestionIndex);
			console.log(response.data);

		} catch (err) {
			// Manejar errores en la solicitud POST
			console.error(`Error al enviar la respuesta: ${err.message}`);
		}
	};

	useEffect(() => {
    setButtonDisabled(optionSelected === null);
  }, [optionSelected]);

	const handleRadioChange = (event) => {
    setOptionSelected(event.target.value);
		console.log("Opción seleccionada:", optionSelected);
  };


	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
			const getData = async () => {
			try {

				// We make sure the test exists
				const response = await axios.get(
					`http://www.beapilot.local:82/?examId=${ testId }`
				);

				// Filtrar preguntas con id_test_student_answer null
        const filteredQuestions = response.data.results.filter(question => question.id_test_student_answer === null);
				console.log(response.data);
				console.log(filteredQuestions);
				setQuiz(filteredQuestions);
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


				{currentQuestion && currentQuestionIndex < quiz.length ? (
					<div >
						<h2>{currentQuestion.string_question}</h2>
								<label htmlFor={currentQuestion.answer_1_id}>
									<span>{currentQuestion.answer_1_string}</span>
									<input
										type="radio"
										id={currentQuestion.answer_1_id}
										name={currentQuestion.id_question}
										value={currentQuestion.answer_1_id}
										checked={optionSelected === currentQuestion.answer_1_id}
										onChange={handleRadioChange}
									/>
								</label>
								<label htmlFor={currentQuestion.answer_2_id}>
									<span>{currentQuestion.answer_2_string}</span>
									<input
										type="radio"
										id={currentQuestion.answer_2_id}
										name={currentQuestion.id_question}
										value={currentQuestion.answer_2_id}
										checked={optionSelected === currentQuestion.answer_2_id}
										onChange={handleRadioChange}
									/>
								</label>
								<label htmlFor={currentQuestion.answer_3_id}>
									<span>{currentQuestion.answer_3_string}</span>
									<input
										type="radio"
										id={currentQuestion.answer_3_id}
										name={currentQuestion.id_question}
										value={currentQuestion.answer_3_id}
										checked={optionSelected === currentQuestion.answer_3_id}
										onChange={handleRadioChange}
									/>
								</label>
								<label htmlFor={currentQuestion.answer_4_id}>
									<span>{currentQuestion.answer_4_string}</span>
									<input
										type="radio"
										id={currentQuestion.answer_4_id}
										name={currentQuestion.id_question}
										value={currentQuestion.answer_4_id}
										checked={optionSelected === currentQuestion.answer_4_id}
										onChange={handleRadioChange}
									/>
								</label>
								<button onClick={handleAnswerButtonClick} disabled={buttonDisabled}>
					Ejecutar
				</button>
					</div>
				): (
					<h1>Cosas</h1>
				)}

				{/* <button onClick={() => handleAnswerButtonClick()}>Next</button> */}

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