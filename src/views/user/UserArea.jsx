
import SubscriptionWrapper from '../../layouts/SubscriptionWrapper';
import { useAuth } from '../../contexts/AuthContext'


export default function Subscribe() {
 	const { auth } = useAuth();
  // Si auth o auth.user aún no se ha inicializado, muestra un mensaje de "Cargando..."
  if (!auth || !auth.user) {
    return <div>Cargando...</div>;
  }
  const token = auth.token;
  const user = auth.user;
  console.log(user);
	const userID = auth.user.id_user;


  return(
    <SubscriptionWrapper>
      <h1>Detalles de la cuenta</h1>
      <p><b>Estado: </b>
        {user.active_subscription === false ? (
            <span>Inactiva</span>
        ) : (
            user.active_subscription
        )}
      </p>


    </SubscriptionWrapper>
  )
}
