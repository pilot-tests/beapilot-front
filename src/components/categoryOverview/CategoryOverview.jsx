import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Bar from '../Bar';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import AccessContext from '../../contexts/AccessContext';

import HandThumbUpFill from '../svgIcons/HandThumbUpFill';
import HandThumbDownFill from '../svgIcons/HandThumbDownFill';
import "./categoryOverview.scss";

export default function CategoryOverview({ onAddTest }) {

  const [data, setData] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
  const accessStatus = useContext(AccessContext);

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
            {accessStatus === "active" && (
              result.has_tests > 0 ?
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
                    className="font-size-14">
                    Continuar Test
                  </Link>
                  }
                </>
              :
                <button className='btn btn--aslink font-size-12' onClick={() => onAddTest(result)} disabled={loading}>
                  {loading ? 'Cargando...' : 'Empezar Test'}
                </button>
            )}
          </div>
          <Bar rating={result.average_note} className='margin-bottom' />
          <div className="category-list__overview">
            <div className={`category-list__overview__item ${result.total_tests !== 0 ? "category-list__total-tests--empty" : ""}`}
              title="Tests realizados">
              <b>Tests</b> {result.total_tests}
            </div>
            <div className="category-list__overview__item">
              <b><HandThumbUpFill className='alert--icon--success' /></b>{result.approved_tests}
            </div>
            <div className="category-list__overview__item">
              <b><HandThumbDownFill className='alert--icon--danger' /></b>{result.failed_tests}
            </div>
          </div>


        </li>
      ))}
  </ul>
  );

}