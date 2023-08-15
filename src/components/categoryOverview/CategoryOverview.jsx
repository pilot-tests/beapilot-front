import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Bar from '../Bar';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

import "./categoryOverview.scss";

export default function CategoryOverview({ onAddTest }) {

  const [data, setData] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

  const { auth } = useAuth();
  const token = auth.token;
  const userID = auth.user.id_user;

  useEffect(() => {
		const getData = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}averageByCategory`,
					{
						params: {
							token: token,
							userId:userID
						},
						headers: {
							Auth: import.meta.env.VITE_AUTH
						}
					}
				);
				console.log("user per category info: ", response.data);
				setData(response.data);
				setError(null);
			} catch (err) {
				setError(err.message);
				setData(null);
			} finally {
				setLoading(false);
			}
		};
		getData();
	}, []);

  return (
  <ul className="category-list">
    {data &&
      data.results.map((result) => (
        <li
          className={`category-list__item ${result.name_category}`}
          key={result.id_category}
          style={{ '--color-bg-cat': `var(--color-cat-${result.id_category})` }}>

          <h2 className="category-list__title">{result.name_category}</h2>
          <div className="category-list__body">
            <p className="category-list__rating" >{result.average_note ? result.average_note : "00.00" } <span className="category-list__percent">%</span></p>
              {result.has_tests > 0 ?
                <>
                  {Number(result.has_inprogress_tests) != 1 ?
                    <>
                      <button className='btn btn--aslink font-size-12' onClick={() => onAddTest(result)} disabled={loading}>
                        {loading ? 'Cargando...' : 'Hacer otro test'}
                      </button>
                    </>
                    :
                    <Link
                    to={{pathname:`/test/${result.inprogress_id_test}`}}
                    className="link-high font-size-12">
                    Continuar Test
                  </Link>
                  }
                </>
              :
                <button className='btn btn--aslink font-size-12' onClick={() => onAddTest(result)} disabled={loading}>
                  {loading ? 'Cargando...' : 'Empezar Test'}
                </button>
              }
          </div>
          <Bar rating={result.average_note} />
          <div
            className={`category-list__total-tests pill ${result.total_tests !== 0 ? "category-list__total-tests--empty" : ""}`}
            title="Tests realizados">
              Tests: {result.total_tests}
          </div>

        </li>
      ))}
  </ul>
  );

}