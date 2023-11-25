import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import VisitorWrapper from '../../layouts/VisitorWrapper';
import axios from 'axios';
import "./Register.scss";

export function RegistrationForm() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [subscription_type, setSubscription_type] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sessionObj = await fetchCreateStripeSession(email, password, name, subscription_type);
    const { sessionId, error: fetchError } = sessionObj;

    if (fetchError) {
      setError(fetchError);
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    if (subscription_type != 'free') {
      // Si el tipo de suscripción es 'free', redirige a Stripe
      const result = await stripe.redirectToCheckout({
        sessionId
      });

      if (result.error) {
        console.log("results here:", result.error.message);
      }
    } else {
      navigate("/");
    }
  };

  return (
    <VisitorWrapper>
      <div className="">

        <h1 className="title-page">Precios por acceso</h1>
        <p className="font-size-20 margin-bottom-64 alig-center block-medium-big">Ofrecemos un plan casual para que sólo practiques tests o un plan más enfocado aprobar el test teórico PPL, ofreciéndote una ruta de estudios por medio de nuestra Inteligencia Artificial</p>
        <form onSubmit={handleSubmit}>
          <div className="pricetag__container">
            <label htmlFor="free" className="pricetag">
              <div className="pricetag__text">
                Plan básico <span>Gratis</span>
              </div>
              <p className="pricetag__text__period">de por vida</p>
              <span className="btn btn--full btn--cta margin-bottom-18">Selecciona el plan gratuito</span>
              <input
                type="radio"
                name="plan"
                value="free"
                required={true}
                id="free"
                onChange={(e) => setSubscription_type(e.target.value)}
              />
              <h5>Incluye:</h5>
              <ul className="pricetag__list">
                <li>Tests para la licencia TPL <small>(más de 2500 preguntas)</small></li>
              </ul>

              <div className="pricetag__check">
                <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="61" height="52" viewBox="0 0 61 52" className="check-icon">
                  <path d="M56.560,-0.010 C37.498,10.892 26.831,26.198 20.617,33.101 C20.617,33.101 5.398,23.373 5.398,23.373 C5.398,23.373 0.010,29.051 0.010,29.051 C0.010,29.051 24.973,51.981 24.973,51.981 C29.501,41.166 42.502,21.583 60.003,6.565 C60.003,6.565 56.560,-0.010 56.560,-0.010 Z" id="path-1" className="cls-2" fillRule="evenodd"/>
                </svg>
              </div>
            </label>
            <label htmlFor="premium" className="pricetag">
              <div className="pricetag__text">
                Plan premium <span>30€</span>
              </div>
              <p className="pricetag__text__period">/mes</p>
              <span className="btn btn--full btn--cta margin-bottom-18">Selecciona el plan premium</span>
              <input
                type="radio"
                name="plan"
                value="premium"
                id="premium"
                onChange={(e) => setSubscription_type(e.target.value)}
              />
              <h5>Incluye:</h5>
              <ul className="pricetag__list">
                <li>Exámenes con formato AESA</li>
                <li>Más de 2500 preguntas</li>
                <li>Estadísticas completas</li>
                <li>Tutoría por Inteligencia Artificial</li>
              </ul>
              <div className="pricetag__check">
                <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="61" height="52" viewBox="0 0 61 52" className="check-icon">
                  <path d="M56.560,-0.010 C37.498,10.892 26.831,26.198 20.617,33.101 C20.617,33.101 5.398,23.373 5.398,23.373 C5.398,23.373 0.010,29.051 0.010,29.051 C0.010,29.051 24.973,51.981 24.973,51.981 C29.501,41.166 42.502,21.583 60.003,6.565 C60.003,6.565 56.560,-0.010 56.560,-0.010 Z" id="path-1" className="cls-2" fillRule="evenodd"/>
                </svg>
              </div>
            </label>
          </div>

        <div className="block-medium">
          <label>
            Nombre:
            <input
              type="text"
              placeholder="Jon Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              placeholder="jon@doe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña:
            <input
              type="password"
              placeholder="zZ$&1234abcd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="alert alert--danger">{error}</div>}
          <button className="btn--cta" type="submit" disabled={!stripe}>
            Registrarse
          </button>
          </div>
        </form>
      </div>
    </VisitorWrapper>
  );
}

async function fetchCreateStripeSession(email, password, name, subscription_type) {
  // Los datos del usuario para enviar a tu API.
  const data = new URLSearchParams();
  data.append("email_user", email);
  data.append("password_user", password);
  data.append("name_user", name);
  data.append("subscription_type", subscription_type);
  console.log(data["subscription_type"]);


  // Hacer la llamada a tu API.
  try {
    // Hacer la llamada a tu API.
    const response = await axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}users?register=true`,
      headers: {
        Auth: import.meta.env.VITE_AUTH,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data
    });


    console.log("response", response);
    const sessionId = response.data.results.stripe_session_id
    console.log("sessionId: ", sessionId);
    console.log("data: ", response.data);

    return {
      sessionId: response.data.results.stripe_session_id,
      subscription_type: response.data.results.subscription_type
    }
  } catch (error) {
    let errorMessage;
  // console.error("Error fetching Stripe session ID", error);
  // console.error("Error message:", error.message);
  // console.error("HTTP response:", error.response);
    if (error.response) {
        // El servidor respondió con un estado fuera del rango 2xx
        errorMessage = error.response.data.results;
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      errorMessage = 'No response was received';
    } else {
      // Algo salió mal al configurar la solicitud
      errorMessage = 'Error setting up request';
    }
    return { sessionId: null, error: errorMessage };
  }
}
