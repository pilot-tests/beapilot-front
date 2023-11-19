
import React, { useState, useEffect } from "react";
import axios from "axios"
import UserWrapper from '../../layouts/UserWrapper';
import { useAuth } from '../../contexts/AuthContext'
import Loader from "../../components/loader/Loader";


export default function Subscribe() {
  const { auth } = useAuth();
  const { updateAuthUser } = useAuth();
  if (!auth || !auth.user) {
    return <div>Cargando...</div>;
  }
  const [userStripe, setUserStripe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = auth.token;
  const user = auth.user;
	const userStripeId = auth.user.stripe_customer_id;
  const [subscriptionType, setSubscriptionType] = useState(user.subscription_type);
  console.log(user);



  const cancelSubscription = async () => {
    setLoading(true);

    const data = new URLSearchParams();
    data.append("cancelCustomerNumber", userStripeId);

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Auth: import.meta.env.VITE_AUTH,
                token: token
            }
        });

        if (response.data.results.subscription_status === "canceled") {
          // Obtener el objeto 'user' actual desde localStorage
          let user = JSON.parse(localStorage.getItem('user'));

          // Actualizar el objeto 'user' con los nuevos valores
          user = { ...user, stripe_active_subscription: "false", subscription_type: "free" };

          // Guardar el objeto 'user' actualizado de nuevo en localStorage
          localStorage.setItem('user', JSON.stringify(user));
          // Actualizar el contexto de autenticación
          updateAuthUser({ stripe_active_subscription: "false", subscription_type: "free" });

          setSubscriptionType("free");
          alert("Subscripción cancelada con éxito");


          getStripeData();
        } else {
            alert("Error al cancelar la suscripción. Inténtalo de nuevo.");
            setLoading(false);
        }
        console.log("Cancel Subscription: ", response.data.results.subscription_status);

    } catch (error) {
        if (error.response) {
            // El servidor respondió con un estado fuera del rango 2xx
            console.error("Server Error:", error.response.data);
            alert("Error al cancelar la suscripción. Inténtalo de nuevo.");
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error("No response:", error.request);
            alert("Ocurrió un error al intentar cancelar. Inténtalo de nuevo.");
        } else {
            // Algo salió mal al configurar la solicitud
            console.error("Axios Error:", error.message);
            alert("Ocurrió un error al intentar cancelar. Inténtalo de nuevo.");
        }
        setLoading(false);
    }
  };


  const resubscribe = async () => {
    setLoading(true);

    const data = new URLSearchParams();
    data.append("ResubscribeCustomerNumber", userStripeId);

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Auth: import.meta.env.VITE_AUTH,
                token: token
            }
        });

        // Aquí puedes manejar la respuesta. Por ejemplo:
        console.log("respuesta on resubscribe:", response);

        if (response.data.results.subscription_status ==	"active") {
           let user = JSON.parse(localStorage.getItem('user'));

            // Actualizar el objeto 'user' con los nuevos valores
            user = { ...user, stripe_active_subscription: "active", subscription_type: "premium" };

            // Guardar el objeto 'user' actualizado de nuevo en localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Actualizar el contexto de autenticación
            updateAuthUser({ stripe_active_subscription: "active", subscription_type: "premium" });
            setSubscriptionType("free");
;
        } else {
            alert("Error al resubscribir. Inténtalo de nuevo.");
            setLoading(false);
        }

        getStripeData();
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un estado fuera del rango 2xx
            console.error("Server Error:", error.response.data);
            alert("Error al resubscribir. Inténtalo de nuevo.");
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error("No response:", error.request);
            alert("Ocurrió un error al intentar resubscribir. Inténtalo de nuevo.");
        } else {
            // Algo salió mal al configurar la solicitud
            console.error("Axios Error:", error.message);
            alert("Ocurrió un error al intentar resubscribir. Inténtalo de nuevo.");
        }
        setLoading(false);
    }
  };

  const getStripeData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}stripeUsers`, {
          params: {
            getStripeData: true,
            customerNumber: userStripeId,
            token: token
          },
          headers: {
              Auth: import.meta.env.VITE_AUTH
          }
        });
        setUserStripe(response.data.results);
        console.log("getStripeData:", response.data.results);

        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
            setError("Error obteniendo tus datos de Stripe -Recarga la página.");
        } else {
            setError(err.message);
        }
      setUserStripe(null);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    getStripeData();
  }, []);

  if (loading) {
    return <Loader loadingText="Actualizando su subscripción... No recargue la página"/>;
  }



  return(
    <UserWrapper>
      <h1>Detalles de la cuenta</h1>
      <div className="ui-block ui-centered">
        <dl className="dl-horizontal">
          <dt>Email:</dt>
          <dd>{user && user.email_user}</dd>
          <dt>Subscripciçon actual: </dt>
          <dd>
              {user && user.subscription_type}
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
              "N/A"
            }
          </dd>
        </dl>
        {user && user.subscription_type === "premium" ?
          <button className='btn btn--danger' onClick={cancelSubscription}>Cancelar subscripción</button>
        :
          <button className='btn' onClick={resubscribe}>Subscribir</button>
        }
      </div>
    </UserWrapper>
  )
}
