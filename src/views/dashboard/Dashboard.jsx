import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../../contexts/AuthContext'
import UserWrapper from "../../layouts/UserWrapper";
import CategoryOverview from "../../components/categoryOverview/CategoryOverview";
import NumberOfTests from "../../components/dashboard/NumberOfTests";
import { Link, useNavigate } from "react-router-dom";
import GlobalFeedback from "../../components/GlobalFeedback";
import './Dashboard.scss';

export default function AsignaturesList() {

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const navigate = useNavigate();
	const { auth } = useAuth();
  const token = auth.token;
  const user = auth.user;
	const userID = auth.user.id_user;


	const handleAddTest = async (result) => {
    setLoading(true);

    try {
      const postTestData = {
				id_category_test: result.id_category,
				id_user_test: userID,
				id_category_question: result.id_category,
				newTest: true
			};
			const serializedData = new URLSearchParams(postTestData).toString();

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}test`,
				serializedData,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Auth: import.meta.env.VITE_AUTH,
						token: token
					}
				}
			);
      if (response.status === 200) {
        navigate(`/test/${response.data.results}`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };








	return (
		<UserWrapper>
			{loading && <div>A moment please...</div>}
			{error && (
				<div>{`There is a problem fetching the post data - ${error}`}</div>
			)}

			<GlobalFeedback />
			<CategoryOverview onAddTest={handleAddTest} />
			<NumberOfTests />


		</UserWrapper>
	);
}
