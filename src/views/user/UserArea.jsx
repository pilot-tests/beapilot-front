
import React, { useState, useEffect } from "react";
import axios from "axios"
import UserWrapper from '../../layouts/UserWrapper';
import { useAuth } from '../../contexts/AuthContext'


export default function Subscribe() {
  const { auth } = useAuth();
  if (!auth || !auth.user) {
    return <div>Cargando...</div>;
  }
  const [userStripe, setUserStripe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = auth.token;
  const user = auth.user;
	const userID = auth.user.id_user;

  console.log(user);

  useEffect(() => {
    const getStripeData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}stripeUsers`, {
          params: {
            getStripeData: true,
            customerNumber: "cus_ObnSh5rPoP9Fhi",
            token: token
          },
          headers: {
              Auth: import.meta.env.VITE_AUTH
          }
        });
        console.log("response data: ", response.data.results);
        setUserStripe(response.data.results);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
            setError("No has hecho ningún test, empieza ahora!");
        } else {
            setError(err.message);
        }
      setUserStripe(null);
      } finally {
        setLoading(false);
      }
    };
    getStripeData();
  }, []);

  if (loading) {
    return <div>Cargando datos...</div>;
  }



  return(
    <UserWrapper>
      <h1>Detalles de la cuenta</h1>
      <div className="ui-block ui-centered">
        <dl className="dl-horizontal">
          <dt>Estado: </dt>
          <dd>
            {user.active_subscription === false ? (
              <span>Inactiva</span>
            ) : (
                user.active_subscription
            )}
          </dd>

          <dt>Próxima fecha de facturación:</dt>
          <dd>
            {userStripe && userStripe.next_billing_date ?
              new Date(userStripe.next_billing_date * 1000).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            :
              "Cargando fecha..."
            }
          </dd>
        </dl>
        <button className='btn btn--danger'>Cancelar subscripción</button>
      </div>
    </UserWrapper>
  )
}
