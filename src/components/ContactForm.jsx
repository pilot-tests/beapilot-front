import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom";

function ContactForm() {
  const navigate = useNavigate();
	const { auth } = useAuth();
  const token = auth.token;
  const userName = auth.user.name_user;
	const userEmail = auth.user.email_user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState('');




  const [formData, setFormData] = useState({
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const contactData = {
        name: userName,
        email: userEmail,
        message: formData.message,
        userContact: true,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}userContact`,
        contactData,
        {
          headers: {
            'Content-Type': 'application/json',
            Auth: import.meta.env.VITE_AUTH,
            token: token,
          },
        }
      );

      if (response.status === 200) {
        setFeedbackMessage('Mensaje enviado correctamente.');
        setFeedbackType('success');
      }
    } catch (error) {
        setFeedbackMessage('Ocurrió un error al enviar el mensaje. Por favor, intenta de nuevo más tarde.');
      setFeedbackType('danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className='ui-block' onSubmit={handleContactFormSubmit}>
      <dl className='dl-horizontal'>
        <dd>Email:</dd>
        <dt>{userEmail && userEmail}</dt>
        {userName && (
          <>
            <dd>Nombre:</dd>
            <dt>{userName}</dt>
          </>
        )}
      </dl>

      <div>
        <label htmlFor="message">Mensaje:</label>
        <textarea
          id="message"
          className='margin-bottom'
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="align-right">
        {feedbackMessage && (
          <>
            <div className={`alert alert--${feedbackType} margin-bottom`}>
              {feedbackMessage}
            </div>
            <p className='align-left'>
              <small>Debido a la gran cantidad de mensajes que recibimos, puede que tardemos hasta 24h en responder.</small>
            </p>
          </>
        )}
        <button
          className='btn btn--cta margin-bottom'
          onClick={handleContactFormSubmit}
          disabled={isSubmitting || feedbackType === 'success'}
        >
          {feedbackType === 'success' ? "mensaje enviado" : "Enviar" }
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
