import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from '../../contexts/AuthContext'
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
	const [testFinishedData, setTestFinishedData] = useState(null);
	const [seconds, setSeconds] = useState(null);
	const [selectedAnswer, setSelectedAnswer] = useState(testData ? testData[currentQuestion].id_answer_student_answer : null);





	const { testId } = useParams();
	const { auth } = useAuth();
  const token = auth.token;
	const userID = auth.user.id_user;
	const userEmail = auth.user.email_user;

  const answerLetters = ['A', 'B', 'C', 'D'];

	const formatTime = (seconds) => {
		const min = Math.floor(seconds / 60);
		const sec = seconds % 60;
		return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
	};

	// useEffect(() => {
  // 	console.log('Is Test Finished:', isTestFinished);
	// }, [isTestFinished]);
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
			setIsTestFinished(true);
		}
	};


	const checkTestStatus = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_URL}relations`, {
				headers: {
					Auth: import.meta.env.VITE_AUTH
				},
				params: {
					rel: 'test,openai',
					type: 'id_test,id_test_openai',
					select: '*',
					linkTo: 'id_test,finished_test',
					equalTo: `${testId},1`,
					token: token
				}
			});
		} catch (err) {
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
        console.error(error);
    }

		setSelectedAnswer(answerId);
	};


	useEffect(() => {
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

				const testTimeInMinutes = response.data.examDetails[0].testtime_category.split(':')[2];
				const testTimeInSeconds = parseInt(testTimeInMinutes) * 60;
				setSeconds(testTimeInSeconds);

				console.log("Test response:", response.data);
				setTestData(response.data.results);
				setExamDetails(response.data.examDetails[0]);
				if(response.data.examDetails[0].finished_test === 1) {
					checkTestStatus();
					console.log("TEST FINALIZADO!");

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
				console.log(transformedResults);

			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		getData();
	}, []);


  useEffect(() => {
		if (seconds > 0) {
			const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
			return () => clearTimeout(timerId);
		} else if (seconds === 0) {
			// Si el tiempo se agotó, finalizar el examen
			finishTest();
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
			<div className="test__topbar">
				{loading && <div>A moment please...</div>}
				{error && (
					<div>{`There is a problem fetching the post data - ${error}`}</div>
				)}

				<dl className="dl-horizontal">
					<dt>Alumno</dt>
					<dd>{userEmail}</dd>
					<dt>Categoría</dt>
					<dd>{examDetails && examDetails.name_category}</dd>
					<dt>Tiempo restante</dt>
					<dd>{isTestFinished ? "Test finalizado" : formatTime(seconds)}</dd>
				</dl>
				<div className="test__topbar--action">
					<button onClick={finishTest} disabled={isTestFinished}>Finalizar Test</button>
				</div>

					{
						testFinishedData && testFinishedData.results.length > 0 && testFinishedData.results[0].response_openai &&
						<div>
							<h3>Respuesta de OpenAI:</h3>
							<div dangerouslySetInnerHTML={{ __html: testFinishedData.results[0].response_openai }} />;
						</div>
					}
			</div>
			<div className="test">
				<aside className="test__aside">
					<ul className="test__list">
						{testData && testData.map((item, index) => (
							<li key={index} className={`test__indicator ${currentQuestion === index ? 'test__indicator--current' : ''}`}onClick={() => handleQuestionClick(index)}>

								<div className="test__indicator__qnumber">
									{index + 1}
								</div>
								<div className="test__answered">
									{item.student_answer ? item.student_answer.order : ''}
								</div>


							</li>
						))}
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
								<details>
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