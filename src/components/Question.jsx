import React from 'react';

export default function Question({ question, onOptionSelected, onSubmit, buttonDisabled }) {
    return (
			<div>
				<h2>{question.string_question}</h2>
				<label htmlFor={question.answer_1_id}>
						<span>{question.answer_1_string} (id: {question.answer_1_id})</span>
						<input
								type="radio"
								id={question.answer_1_id}
								name={question.id_question}
								value={question.answer_1_id}
								onChange={onOptionSelected}
						/>
				</label>
				<label htmlFor={question.answer_2_id}>
						<span>{question.answer_2_string} (id: {question.answer_2_id})</span>
						<input
								type="radio"
								id={question.answer_2_id}
								name={question.id_question}
								value={question.answer_2_id}
								onChange={onOptionSelected}
						/>
				</label>
				<label htmlFor={question.answer_3_id}>
						<span>{question.answer_3_string} (id: {question.answer_3_id})</span>
						<input
								type="radio"
								id={question.answer_3_id}
								name={question.id_question}
								value={question.answer_3_id}
								onChange={onOptionSelected}
						/>
				</label>
				<label htmlFor={question.answer_4_id}>
						<span>{question.answer_4_string} (id: {question.answer_4_id})</span>
						<input
								type="radio"
								id={question.answer_4_id}
								name={question.id_question}
								value={question.answer_4_id}
								onChange={onOptionSelected}
						/>
				</label>
				<button onClick={onSubmit} disabled={buttonDisabled}>
						Ejecutar
				</button>
			</div>
    );
}
