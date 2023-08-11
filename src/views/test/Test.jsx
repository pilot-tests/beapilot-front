import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from '../../contexts/AuthContext'
import Loader from "../../components/loader/Loader";
import axios from "axios"
import UserWrapper from "../../layouts/UserWrapper";
import "./Test.scss"


export default function Test() {

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [testData, setTestData] = useState(null);
	const [examDetails, setExamDetails] = useState(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [isTestFinished, setIsTestFinished] = useState(false);
	const [testResults, setTestResults] = useState(null);
	const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
	const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
	const [unansweredCount, setUnansweredCount] = useState(0);

	const [seconds, setSeconds] = useState(null);
	const [selectedAnswer, setSelectedAnswer] = useState(testData ? testData[currentQuestion].id_answer_student_answer : null);

	const { testId } = useParams();
	const { auth } = useAuth();
  const token = auth.token;
	const userID = auth.user.id_user;
	const userEmail = auth.user.email_user;
	const LOCAL_STORAGE_KEY = `test_timer_${testId}`;  // El key de localstorage es específico para cada test

  const answerLetters = ['A', 'B', 'C', 'D'];

	const formatTime = (seconds) => {
		const min = Math.floor(seconds / 60);
		const sec = seconds % 60;
		return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
	};


	const finishTest = async () => {
		console.log("Finalizando test!");

		setLoading(true);
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
		} catch (err) {
			setError(err.message);
			console.error(`Error al hacer la petición PUT: ${err.message}`);
		} finally {
			setIsTestFinished(true);
			setLoading(false);
			localStorage.removeItem(LOCAL_STORAGE_KEY);
			await getData();
		}
	};


	const getTestResults = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_URL}testResult`, {
				headers: {
					Auth: import.meta.env.VITE_AUTH
				},
				params: {
					examId: testId,
					userId: userID,
					token: token
				}
			});
			setTestResults(response.data.results);
			const correctAnswers = response.data.results.filter(result => result.correct_answered === 1).length;
			console.log(correctAnswers);

			const incorrectAnswers = response.data.results.filter(result => result.correct_answered === 0 && result.id_answer_student_answer !== null).length;
			const unanswered = testData.length - correctAnswers - incorrectAnswers;

			setCorrectAnswersCount(correctAnswers);
			setIncorrectAnswersCount(incorrectAnswers);
			setUnansweredCount(unanswered);


			console.log("And then this is the test results response: ", response.data)
		} catch (err) {
			setError(err.message);
			console.error(`Error al verificar el estado del test: ${err.message}`);
		}
	};



	const handleAnswerChange = async (questionId, answerId) => {
		const questionData = testData.find(item => item.id_question === questionId);
    const studentAnswerId = answerId;
		if (isTestFinished) {
			return;
		}

		// Encontrar el objeto de respuesta correspondiente
		const answerObject = Object.entries(questionData)
		.filter(([key, _]) => key.startsWith('answer') && key.endsWith('id'))
		.map(([key, value]) => ({id: value, order: questionData[key.replace('id', 'order')], string: questionData[key.replace('id', 'string')]}))
		.find(item => item.id === answerId);


		try {

			const dataUpdate = {
			id_answer_student_answer: answerId,
			};
			const dataNew = {
				id_user_student_answer: userID,
				id_answer_student_answer: answerId,
				id_question_student_answer: questionData.id_question,
				id_test_student_answer: testId,
			};
			console.log("studentAnswerId", studentAnswerId)

        if (questionData.id_answer_student_answer) {
            // Actualizar la respuesta existente
						await axios.put(
							`${import.meta.env.VITE_API_URL}student_answers?id=${questionData.id_question}&nameId=id_question_student_answer`, dataUpdate,
							{
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
									Auth: import.meta.env.VITE_AUTH,
									token: token
								}
							}
            );
						// Actualizar la respuesta en el estado local
						setTestData(testData.map(item => {
							if (item.id_question === questionId) {
								return {...item, student_answer: answerObject};

							} else {
								return item;
							}
						}));

						console.log("TestData after PUT:", testData);
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
          const newAnswerId = response.data.results.lastId;
          console.log("New Nawer ID: ", newAnswerId)
          setTestData(testData.map(item => {

            if (item.id_question === questionId) {
                return {...item, student_answer: answerObject};
            } else {
                return item;
            }
          }));
          console.log("TestData after POST:", testData);
        }
    } catch (error) {
				setError(err.message);
        console.error(error);
    }

		setSelectedAnswer(answerId);
	};



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


			const convertToUTCDate = (rawDate) => {
				return new Date(Date.UTC(
					rawDate.getUTCFullYear(),
					rawDate.getUTCMonth(),
					rawDate.getUTCDate(),
					rawDate.getUTCHours(),
					rawDate.getUTCMinutes(),
					rawDate.getUTCSeconds()
				));
			};

			// Convertir las fechas a UTC
			const creationDate = convertToUTCDate(new Date(response.data.examDetails[0].creationdate_test));
			const serverTime = convertToUTCDate(new Date(response.data.examDetails[0].serverTime));

			// Calcular el tiempo restante
			const timeDifferenceInSeconds = (serverTime - creationDate) / 1000;
			const testTimeInMinutes = parseInt(response.data.examDetails[0].testtime_category.split(':')[2]);
			const testTimeInSeconds = testTimeInMinutes * 60;
			const remainingTime = testTimeInSeconds - timeDifferenceInSeconds;
			console.log(localStorage);





			// Obtener o establecer el tiempo restante
			const storedTime = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (storedTime) {
					setSeconds(storedTime);
					console.log("Existe en la cookie", storedTime);
			} else {
				console.log("No existe en la cookie, segundos equivale a:", seconds);
				setSeconds(Math.max(0, remainingTime));
				console.log("Después de setSeconds:", seconds);

				localStorage.setItem(LOCAL_STORAGE_KEY, remainingTime);
			}


			console.log("Test response:", response.data);
			setTestData(response.data.results);
			setExamDetails(response.data.examDetails[0]);
			if(response.data.examDetails[0].finished_test === 1) {
				setIsTestFinished(true);
				getTestResults();
				console.log("First, we get test results");

			}
			setSelectedAnswer(response.data.results[currentQuestion].id_answer_student_answer);

			const transformedResults = response.data.results.map(question => {
				const answerObject = Object.entries(question)
				.filter(([key, _]) => key.startsWith('answer') && key.endsWith('id'))
				.map(([key, value]) => ({id: value, order: question[key.replace('id', 'order')], string: question[key.replace('id', 'string')]}))
				.find(item => item.id === question.id_answer_student_answer);
				return {...question, student_answer: answerObject};
			});

			setTestData(transformedResults);

		} catch (err) {
			setError(`Error obteniendo los datos del examen: ${err.message}`);
			console.error(`Error obteniendo los datos del examen: ${err.message}`);

		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
    getData();
	}, []);

  useEffect(() => {
		if (seconds === null) return;
    if (seconds > 0) {
			const timerId = setTimeout(() => {
					setSeconds(prev => prev - 1);
					localStorage.setItem(LOCAL_STORAGE_KEY, seconds - 1);
			}, 1000);
			return () => clearTimeout(timerId);
    } else {
			if (!isTestFinished) {
				finishTest();
				console.log("CALLING FINISHED TEST FUNCTION!!!!");
			}
			localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
	}, [seconds]);

	const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
  }

	const handleNextClick = () => {
    if (currentQuestion < testData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Aquí aseguramos que student_answer exista antes de intentar acceder a su propiedad id
      setSelectedAnswer(testData[currentQuestion + 1].student_answer ? testData[currentQuestion + 1].student_answer.id : null);
    }
	}

	const handlePrevClick = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1);
			// Aquí aseguramos que student_answer exista antes de intentar acceder a su propiedad id
			setSelectedAnswer(testData[currentQuestion - 1].student_answer ? testData[currentQuestion - 1].student_answer.id : null);
		}
	}




	return (
		<UserWrapper>
			{
					examDetails && examDetails.response_openai &&
					<div dangerouslySetInnerHTML={{ __html: examDetails.response_openai }} />
				}

			<div className="test__topbar">
				{loading && <Loader loadingText="Finalizando test, esto puede llevar hasta un minuto... No recargue la página"/>}
				{error && (
					<div>{error}</div>
				)}

				<dl className="dl-horizontal">
					<dt>Alumno</dt>
					<dd>{userEmail}</dd>
					<dt>Categoría</dt>
					<dd>{examDetails && examDetails.name_category}</dd>
					{isTestFinished
						? <>
								<div className="alert alert--danger t-align-center">TEST FINALIZADO</div>
							</>
						:  <>
								<dt>Tiempo restante</dt>
								<dd>{formatTime(seconds)}</dd>
							</>
					}
				</dl>
				<div className="test__topbar--action">
					{isTestFinished ? '' : <button onClick={finishTest} disabled={isTestFinished}>Finalizar Test</button>}

				</div>
			</div>
			{isTestFinished &&
				<table className="table-singledata">
					<thead>
						<tr>
							<th>Correctas</th>
							<th>Incorrectas</th>
							<th>No respondidas</th>
							<th>Nota %</th>
						</tr>
					</thead>
					<tbody>
						<tr className="font-size-32 font-weight-bold">
							<td>{correctAnswersCount}</td>
							<td>{incorrectAnswersCount}</td>
							<td>{unansweredCount}</td>
							<td>{examDetails.final_note}</td>
						</tr>
					</tbody>
				</table>
			}

			<div className="test">
				<aside className="test__aside">
					<ul className="test__list">
						{testData && testData.map((item, index) => {
							let testResult = testResults ? testResults.find(result => result.id_question === item.id_question) : null;
							return(
								<li
									key={index}
									className={`test__indicator ${currentQuestion === index ? 'test__indicator--current' : ''}
									${isTestFinished ? (testResult && testResult.correct_answered === 1 ? 'test__indicator--correct' : 'test__indicator--incorrect') : ''}`}
									onClick={() => handleQuestionClick(index)}>

									<div className="test__indicator__qnumber">
										{index + 1}
									</div>
									<div className="test__answered">
										{item.student_answer ? item.student_answer.order : ''}
									</div>


								</li>
							)
						})}
					</ul>
				</aside>
				<main className="test__main">

					{testData && testData[currentQuestion] &&
						<div className="test__currentquestion">
							<div className="test__navigation">
								<button onClick={handlePrevClick} disabled={currentQuestion === 0}>Previous</button>

								<button onClick={handleNextClick} disabled={currentQuestion === testData.length - 1}>Next</button>
						</div>
							<h1 className="test__currentquestion__title">
								<span className="test__currentquestion__number">{currentQuestion + 1}</span>
								{testData[currentQuestion].string_question}
							</h1>
							<div className="test__currentquestion__answers">
								{Array(4).fill().map((_, i) => {
									const answerId = testData[currentQuestion][`answer_${i + 1}_id`];
									const answerString = testData[currentQuestion][`answer_${i + 1}_string`];

									if (!answerId || !answerString) {
										return null; // No hay más respuestas
									}

									return (
										<div key={answerId} id={answerId} className="test__currentquestion__answer">
											<label>
												<span className="test__currentquestion__answer__letter">{answerLetters[i]}</span>
												<input
													type="radio"
													name={`answer_${currentQuestion}`}
													checked={selectedAnswer === answerId}
													onChange={() => handleAnswerChange(testData[currentQuestion].id_question, answerId)}
												/>
												: {answerString}
											</label>
										</div>
									);
								})}
								<details className="test__details">
									<summary>Ver Anexo</summary>
								{testData[currentQuestion].ai_reasoning_questions}
								</details>
							</div>

						</div>
					}
				</main>
			</div>
		</UserWrapper>
	)
}