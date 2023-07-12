import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from 'axios';

export function RegistrationForm() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sessionObj = await fetchCreateStripeSession(email, password, name);
    const { sessionId, error: fetchError } = sessionObj;

    if (fetchError) {
      setError(fetchError);
      return;
    }

    // Aquí debes hacer una solicitud a tu backend para crear una sesión de pago de Stripe.
    // Reemplaza la siguiente línea con esa llamada a la API.
    // const { stripe_session_id: sessionId } = await fetchCreateStripeSession(email, password, name);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.redirectToCheckout({
      sessionId
    });

    if (result.error) {
      console.log("results here:", result.error.message);
    }
  };

  return (
    <div className="form-center">
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="alert alert--danger">{error}</div>}
        <button type="submit" disabled={!stripe}>
          Registrarse
        </button>
      </form>
    </div>
  );
}

async function fetchCreateStripeSession(email, password, name) {
  // Los datos del usuario para enviar a tu API.
  const data = new URLSearchParams();
  data.append("email_user", email);
  data.append("password_user", password);
  data.append("name_user", name);

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

    return { sessionId: response.data.results.stripe_session_id }
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
