import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios";
import { useAuth } from '../../contexts/AuthContext'
import paperPlane from "../../components/svgIcons/paperPlane";
import './Test.scss'

export default function Test(props) {
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [optionSelected, setOptionSelected] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
	const [finishedTest, setFinishedTest] = useState(false);
	const [questionCount, setQuestionCount] = useState(0);

	const navigate = useNavigate();
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
			const response = await axios.post(`${import.meta.env.VITE_API_URL}student_answers`, data, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Auth: import.meta.env.VITE_AUTH,
					token: token
				}
			});


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
		setLoading(true);  // Comienza la carga
    const finishTest = async () => {
			try {
				const response = await axios({
					method: 'post',
					url: `${import.meta.env.VITE_API_URL}openAi`,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						auth: 'abc',
						token: token
					},
					data: new URLSearchParams({
						prompt: true,
						userId: userID,
						testId: testId,
						type: 1
					})
				});
				console.log(response.data)
			} catch (err) {
					console.error(`Error al hacer la petición PUT: ${err.message}`);
			} finally {
					// Actualiza el estado finishedTest a true una vez que la solicitud PUT se ha completado
					setFinishedTest(true);
					setLoading(false);
					navigate(`/testresult/${testId}`);
			}
		};

		finishTest();
	}, [currentQuestionIndex, quiz, testId]);  // Ejecutamos este efecto cada vez que cambia currentQuestionIndex, quiz o testId





useEffect(() => {
    const checkTestStatus = async () => {
        try {
            // Realizar la solicitud GET para obtener el estado del test
            const response = await axios.get(`${import.meta.env.VITE_API_URL}test?linkTo=id_test&equalTo=${testId}&select=finished_test&token=${token}`, {
                headers: {
                    Auth: import.meta.env.VITE_AUTH
                }
            });

            if (response.data.results[0].finished_test === 1) {
                setFinishedTest(true);
								navigate(`/testresult/${testId}`);
            }
        } catch (err) {
            console.error(`Error al verificar el estado del test: ${err.message}`);
        }
    };

    // Llamar a la función asincrónica dentro del efecto
    checkTestStatus();
}, []);





	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
			const getData = async () => {
			try {

				// We make sure the test exists
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}?examId=${ testId }`,
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
				{loading && <div>A moment please...</div>}
				{error && (
					<div>{`There is a problem fetching the post data - ${error}`}</div>
				)}

				{/* TODO: Refactor this into another component */}
				{currentQuestion && currentQuestionIndex < quiz.length ? (
					<div className="test">
						<div className="test__topbar">
							Pregunta {currentQuestionIndex + 1} de {questionCount}
						</div>
						<div className="test__wrapper">
							<h2 className="test__title">{currentQuestion.string_question}</h2>
							<div className="test__answer">
								<label htmlFor={currentQuestion.answer_1_id}>
									<span>{currentQuestion.answer_1_string}</span>
									<input
										type="radio"
										id={currentQuestion.answer_1_id}
										name={currentQuestion.id_question}
										value={currentQuestion.answer_1_id}
										checked={Number(optionSelected) === currentQuestion.answer_1_id}
										onChange={handleRadioChange}
									/>
								</label>
							</div>
							<div className="test__answer">
								<label htmlFor={currentQuestion.answer_2_id}>
									<span>{currentQuestion.answer_2_string}</span>
									<input
										type="radio"
										id={currentQuestion.answer_2_id}
										name={currentQuestion.id_question}
										value={currentQuestion.answer_2_id}
										checked={Number(optionSelected) === currentQuestion.answer_2_id}
										onChange={handleRadioChange}
									/>
								</label>
							</div>
							<div className="test__answer">
								<label htmlFor={currentQuestion.answer_3_id}>
									<span>{currentQuestion.answer_3_string}</span>
									<input
										type="radio"
										id={currentQuestion.answer_3_id}
										name={currentQuestion.id_question}
										value={currentQuestion.answer_3_id}
										checked={Number(optionSelected) === currentQuestion.answer_3_id}
										onChange={handleRadioChange}
									/>
								</label>
							</div>
							<div className="test__answer">
								<label htmlFor={currentQuestion.answer_4_id}>
									<span>{currentQuestion.answer_4_string}</span>
									<input
										type="radio"
										id={currentQuestion.answer_4_id}
										name={currentQuestion.id_question}
										value={currentQuestion.answer_4_id}
										checked={Number(optionSelected) === currentQuestion.answer_4_id}
										onChange={handleRadioChange}
									/>
								</label>
							</div>
							<button onClick={handleAnswerButtonClick} disabled={buttonDisabled} className="test__button">
								Ejecutar
							</button>
						</div>
					</div>
					): (
						// TODO: Add a nice animation
					<div><paperPlane /></div>
				)}
			</>
		);
}




///////////
///////////
///////////
///////////
///////////
///////////
///////////
///////////
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from '../../contexts/AuthContext'
import axios from "axios"
import "./Test.scss"


export default function Test() {

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [testData, setTestData] = useState(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);


	const { testId } = useParams();
	const { auth } = useAuth();
  const token = auth.token;
	const userID = auth.user.id_user;

	const handleAnswerChange = async (questionId, answerId) => {
		const questionData = testData.find(item => item.id_question === questionId);
    const studentAnswerId = questionData.id_student_answer;



		try {

			const dataUpdate = {
			id_answer_student_answer: questionData.id_student_answer,
			};
			const dataNew = {
				id_user_student_answer: userID,
				id_answer_student_answer: answerId,
				id_question_student_answer: questionData.id_question,
				id_test_student_answer: testId,
			};

			console.log("Data: ", answerId)
			console.log("Question Answer Id" , questionData.
			id_student_answer)
        if (questionData.id_student_answer) {
            // Actualizar la respuesta existente
             await axios.put(
                `${import.meta.env.VITE_API_URL}student_answers?id=${studentAnswerId}&nameId=id_student_answer`, dataUpdate,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Auth: import.meta.env.VITE_AUTH,
                        token: token
                    }
                }
            );
        } else {
            // Crear una nueva respuesta
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}student_answers`,
                dataNew,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Auth: import.meta.env.VITE_AUTH,
                        token: token
                    }
                }
            );
						const newAnswerId = response.data.lastId;
						setTestData(testData.map(item => {
							console.log("item.id_question: ", item.id_question)
							console.log("questionId: ", questionId)
							if (item.id_question === questionId) {
									return {...item, id_student_answer: newAnswerId};
							} else {
									return item;
							}
						}));
        }
    } catch (error) {
        console.error(error);
    }
	};


	useEffect(() => {
		// TODO: Refactor this, this is how we access the TEST
		const getData = async () => {
			try {

				// We make sure the test exists
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}?examId=${ testId }`,
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

				// Filtrar preguntas con id_test_student_answer null
				console.log("Test response:", response.data);
				setTestData(response.data.results);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		getData();
	}, []);

	const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
  }

	const handleNextClick = () => {
    if (currentQuestion < testData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

	const handlePrevClick = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }


	return (
		<>
			{loading && <div>A moment please...</div>}
			{error && (
				<div>{`There is a problem fetching the post data - ${error}`}</div>
			)}
			<div className="test">
				<aside className="test__aside">
					<ul className="test__list">
						{testData && testData.map((item, index) => (
							<li key={index} className="test__indicator" onClick={() => handleQuestionClick(index)}>

								<div className="test__indicator__qnumber">
									{index + 1}
								</div>
								<div className="test__answered">
									{item.id_test_student_answer ? item.id_test_student_answer : ""}
								</div>

							</li>
						))}
					</ul>
				</aside>
				<main className="test__main">
							{testData && testData[currentQuestion] &&
					<div>
						<p>Question: {testData[currentQuestion].string_question}</p>

						{Array(4).fill().map((_, i) => {
							const answerId = testData[currentQuestion][`answer_${i + 1}_id`];
							console.log(answerId)
							const answerString = testData[currentQuestion][`answer_${i + 1}_string`];

							if (!answerId || !answerString) {
								return null; // No hay más respuestas
							}

							return (
								<div key={answerId} id={answerId}>
									<label>
										<input
											type="radio"
											name={`answer_${currentQuestion}`}
											onChange={() => handleAnswerChange(testData[currentQuestion].id_question, answerId)} />

										{answerString}
									</label>
								</div>
							);
						})}



						<button onClick={handlePrevClick} disabled={currentQuestion === 0}>Previous</button>

						<button onClick={handleNextClick} disabled={currentQuestion === testData.length - 1}>Next</button>

					</div>}
				</main>
			</div>
		</>
	)
}