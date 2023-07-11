import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setToken(query.get('token'));
  }, []);


  useEffect(() => {
    if (!token) return;
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}verify-email`,
          {
            params: {
              token: token,
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

    verifyEmail();
  }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Email Verification Status</h2>
      {(() => {
        switch (data.status) {
          case 200:
            return (
              <div>
                <p>Email verificado con éxito.</p>
                <button>Botón para status 200</button>
              </div>
            );
          case 400:
            return (
              <div>
                <p>El enlace de verificación no es válido.</p>
              </div>
            );
          case 404:
            return (
              <div>
                <p>No se encontraron filas afectadas. Ya has sido verificado.</p>
              </div>
            );
          default:
            return (
              <div>
                <p>Ha ocurrido un error desconocido.</p>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default VerifyEmail;
