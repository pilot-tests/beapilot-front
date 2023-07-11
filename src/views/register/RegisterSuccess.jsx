import SubscriptionWrapper from '../../layouts/SubscriptionWrapper';
import LoginForm from '../../components/LoginForm';


function RegisterSuccess() {
  return (
    <SubscriptionWrapper>
      <h1>Registrao!</h1>
      <h2>Haz login para acceder</h2>
      <LoginForm />
    </SubscriptionWrapper>
   );
}

export default RegisterSuccess;