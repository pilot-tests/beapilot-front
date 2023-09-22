import React from "react";

function TestSummaryTable({ correctAnswersCount, incorrectAnswersCount, unansweredCount, finalNote }) {
  return (
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
          <td>{finalNote}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TestSummaryTable;
