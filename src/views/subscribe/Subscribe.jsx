import { useAuth } from '../../contexts/AuthContext'
import SubscriptionWrapper from '../../layouts/SubscriptionWrapper';

export default function Subscribe() {

  const { auth } = useAuth();
  const user = auth.user.name_user;

  return(
    <SubscriptionWrapper>
      <h1>Hola</h1>
    </SubscriptionWrapper>
  )
}
