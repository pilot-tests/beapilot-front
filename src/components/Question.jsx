const Question = ({ question, optionSelected, handleRadioChange }) => (
  <div className="test__wrapper">
    <h2>{question.string_question}</h2>
    {question.answers.map(answer => (
      <label key={answer.id} htmlFor={answer.id} className="test__answer">
        <span>{answer.text} (id: {answer.id})</span>
        <input
          type="radio"
          id={answer.id}
          name={question.id_question}
          value={answer.id}
          checked={optionSelected === answer.id}
          onChange={handleRadioChange}
        />
      </label>
    ))}
  </div>
);
export default Question;