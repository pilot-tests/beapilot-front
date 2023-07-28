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
	const [selectedAnswer, setSelectedAnswer] = useState(null);



	const { testId } = useParams();
	const { auth } = useAuth();
  const token = auth.token;
	const userID = auth.user.id_user;

  console.log("Body Test Data: ", testData);



	const handleAnswerChange = async (questionId, answerId) => {
		const questionData = testData.find(item => item.id_question === questionId);
    const studentAnswerId = answerId;
		console.log("id_student_answer?", answerId)

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
						// Actualizar la respuesta en el estado local
						setTestData(testData.map(item => {
							if (item.id_question === questionId) {
								return {...item, id_student_answer: answerId};
							} else {
								return item;
							}
						}));
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
                return {...item, id_student_answer: newAnswerId};
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
                      checked={selectedAnswer === answerId}
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