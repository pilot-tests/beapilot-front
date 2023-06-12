import React, { useEffect, useState } from "react";
import TestResult from '../components/TestResult'
import { useParams  } from "react-router-dom"
import axios from "axios";
import { useAuth } from '../contexts/AuthContext'

export default function Test(props) {
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [optionSelected, setOptionSelected] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
	const [finishedTest, setFinishedTest] = useState(false);
	const [questionCount, setQuestionCount] = useState(0);

	const { testId } = useParams();
	const { auth } = useAuth();
  const token = auth.token;
  const user = auth.user;
	const userID = auth.user.id_user;


	const currentQuestion = quiz && quiz[currentQuestionIndex]

	const handleAnswerButtonClick = async () => {
		setOptionSelected(null);

		try {
			// Definir los datos que quieres enviar
			const data = {
				id_user_student_answer: userID,
				id_answer_student_answer: optionSelected,
				id_question_student_answer: currentQuestion.id_question,
				id_test_student_answer: testId,
			};

			// Realizar la solicitud POST
			const response = await axios.post(`http://www.beapilot.local:82/student_answers?token=${token}`, data, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Auth: "abc"
				}
			});
			console.log("post response:", userID);


			const nextQuestionIndex = currentQuestionIndex + 1;
			setCurrentQuestionIndex(nextQuestionIndex);
			console.log(nextQuestionIndex);

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

  };





	// we make the PUT to edit the FINISHED test field and the SCORE field:
	useEffect(() => {
    if (!quiz || currentQuestionIndex < quiz.length) {
        return;  // Si no hay preguntas o aún no se han contestado todas, no hacemos nada
    }

    // Si llegamos aquí, significa que ya se han contestado todas las preguntas del test
    // Entonces, hacemos la petición PUT:

    const putData = async () => {
			try {
				const response = await axios.put(`http://www.beapilot.local:82/test?id_test=${testId}&token=${token}`,
				null,  // No body data for this PUT request
				{
					headers: {
						'Auth': 'abc'
					}
				}
			);
				console.log(response.data)
			} catch (err) {
					console.error(`Error al hacer la petición PUT: ${err.message}`);
			} finally {
					// Actualiza el estado finishedTest a true una vez que la solicitud PUT se ha completado
					setFinishedTest(true);
			}
		};

		putData();
	}, [currentQuestionIndex, quiz, testId]);  // Ejecutamos este efecto cada vez que cambia currentQuestionIndex, quiz o testId





useEffect(() => {
    const checkTestStatus = async () => {
        try {
            // Realizar la solicitud GET para obtener el estado del test
            const response = await axios.get(`http://www.beapilot.local:82/test?linkTo=id_test&equalTo=${testId}&select=finished_test&token=${token}`, {
                headers: {
                    Auth: "abc"
                }
            });

            // Suponiendo que 'finished_test' es el campo que indica si el test está terminado
            if (response.data.results[0].finished_test === 1) {
                setFinishedTest(true);
								console.log("Test FInished:", finishedTest);
            }
        } catch (err) {
            console.error(`Error al verificar el estado del test: ${err.message}`);
        }
    };

    // Llamar a la función asincrónica dentro del efecto
    checkTestStatus();
}, []);  // Ejecutar este efecto solo cuando el componente se monta





	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
			const getData = async () => {
			try {

				// We make sure the test exists
				const response = await axios.get(
					`http://www.beapilot.local:82/?examId=${ testId }`,
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

				// Filtrar preguntas con id_test_student_answer null
        const filteredQuestions = response.data.results.filter(question => question.id_test_student_answer === null);
				console.log("Response Data:", response.data);
				console.log(filteredQuestions);
				setQuiz(filteredQuestions);
				setQuestionCount(response.data.total);
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

				{/* TODO: Refactor this into another component */}
				{currentQuestion && currentQuestionIndex < quiz.length ? (
					<div >
						Pregunta {currentQuestionIndex + 1} de {questionCount}
						<h2>{currentQuestion.string_question}</h2>
						<label htmlFor={currentQuestion.answer_1_id}>
							<span>{currentQuestion.answer_1_string} (id: {currentQuestion.answer_1_id})</span>
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
							<span>{currentQuestion.answer_2_string} (id: {currentQuestion.answer_2_id})</span>
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
							<span>{currentQuestion.answer_3_string} (id: {currentQuestion.answer_3_id})</span>
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
							<span>{currentQuestion.answer_4_string} (id: {currentQuestion.answer_4_id})</span>
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
					): finishedTest ? (
					<TestResult test={testId} />
				) : null}
			</>
		);
}