import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function OpenAiDataFetcher() {
    const { auth } = useAuth();
    const token = auth.token;
    const userID = auth.user.id_user;
    const type_openai = encodeURIComponent("global");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://www.beapilot.local:82/openai`, {
                    params: {
                        token: token,
                        select: '*',
                        linkTo: 'id_user_openai,type_openai',
                        equalTo: `${userID},${type_openai}`,
                    },
                    headers: {
                        Auth: "abc"
                    }
                });
                console.log("OpenAI data: ", response.data);
                setData(response.data);
                setError(null);
            } catch (err) {
              if (err.response && err.response.status === 404) {
                  setError("No has hecho ningún test, empieza ahora!");
              } else {
                  setError(err.message);
              }
              setData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {/* Renderiza tus datos aquí. Este es solo un ejemplo. */}
            {data && <p>{data.results[0].response_openai}</p>}
        </div>
    );
}
