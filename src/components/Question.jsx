import React from 'react';

export default function Question({ question, onOptionSelected, onSubmit, buttonDisabled }) {
    return (

<div >
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
  );
}