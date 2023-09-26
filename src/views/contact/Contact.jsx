import React from 'react';
import UserWrapper from "../../layouts/UserWrapper";
import ContactForm from '../../components/ContactForm';

function App() {
  return (
    <UserWrapper>
      <div className="block-small">
        <h1 className='title-page'>Formulario de Contacto</h1>
        <ContactForm />
      </div>
    </UserWrapper>
  );
}

export default App;
