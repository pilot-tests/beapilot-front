import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from 'axios';

export function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sessionObj = await fetchCreateStripeSession(email, password, name);
    const { sessionId } = sessionObj;

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
      console.log(result.error.message);
    }
  };

  return (
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
      <button type="submit" disabled={!stripe}>
        Registrarse
      </button>
    </form>
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
      url: `${process.env.REACT_APP_API_URL}users?register=true`,
      headers: {
        Auth: "abc",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data
    });

    // Asegúrate de devolver el ID de la sesión de Stripe de tu respuesta.
    // Este es solo un ejemplo y necesitarás ajustarlo a cómo se ve tu respuesta real.
    console.log("response", response); // Agrega esto para verificar la respuesta del servidor
    const sessionId = response.data.results.stripe_session_id
    console.log("sessionId: ", sessionId);
    console.log("data: ", response.data);
    return { sessionId: response.data.results.stripe_session_id }
   } catch (error) {
    console.error("Error fetching Stripe session ID", error);
    // Devuelve un objeto con una propiedad `sessionId` nula
    // para evitar errores de "undefined"
    return { sessionId: null };
  }
}
