import VisitorWrapper from '../../layouts/VisitorWrapper';
import LoginForm from '../../components/LoginForm';


function RegisterSuccess() {
  return (
    <VisitorWrapper>
      <h1>Registrao!</h1>
      <h2>Haz login para acceder</h2>
      <LoginForm />
    </VisitorWrapper>
   );
}

export default RegisterSuccess;