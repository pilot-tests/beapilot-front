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
	const [isTestFinished, setIsTestFinished] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState(testData ? testData[currentQuestion].id_answer_student_answer : null);





	const { testId } = useParams();
	const { auth } = useAuth();
  const token = auth.token;
	const userID = auth.user.id_user;
	const userEmail = auth.user.email_user;

  const answerLetters = ['A', 'B', 'C', 'D'];

	useEffect(() => {
  console.log('Is Test Finished:', isTestFinished);
}, [isTestFinished]);
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

			if (response.data.results[0].finished_test === 1) {
				setIsTestFinished(true);
			}
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
		// TODO: Refactor this, this is how we access the TEST
		checkTestStatus();
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
				console.log("Test response:", response.data);
				setTestData(response.data.results);
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
		<>
			<div className="test__topbar">
				{loading && <div>A moment please...</div>}
				{error && (
					<div>{`There is a problem fetching the post data - ${error}`}</div>
				)}
				<div>
					Alumno: {userEmail}
				</div>
				<div>
					{/* Categoría: {testData[currentQuestion].name_category} */}
				</div>

				<div>
					<button onClick={finishTest} disabled={isTestFinished}>Finalizar Test</button>
				</div>
			</div>
			{currentQuestion + 1}
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
						<div>
							<p>Question: {testData[currentQuestion].string_question}</p>

							{Array(4).fill().map((_, i) => {
								const answerId = testData[currentQuestion][`answer_${i + 1}_id`];
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
												checked={selectedAnswer === answerId}
												onChange={() => handleAnswerChange(testData[currentQuestion].id_question, answerId)}
											/>
											{answerLetters[i]}: {answerString}
										</label>
										<details>
											<summary>Razonamiento</summary>
											{testData[currentQuestion].ai_reasoning_questions}
										</details>
									</div>
								);
							})}



							<button onClick={handlePrevClick} disabled={currentQuestion === 0}>Previous</button>

							<button onClick={handleNextClick} disabled={currentQuestion === testData.length - 1}>Next</button>

						</div>
					}
				</main>
			</div>
		</>
	)
}