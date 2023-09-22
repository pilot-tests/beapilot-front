import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom';
import LogoutButton from '../LogoutButton';
import "./Topbar.scss"

export default function Topbar() {
  	const { auth } = useAuth();
    const user = auth?.user?.name_user;
    const idUser = auth?.user?.id_user;

    return (
      <div className="topbar">
      {user ? (
        <>
          <div>
            {user}
          </div>
          <div className="topbar__last">  <LogoutButton />
          </div>
        </>
      ) : (
        <>
          {/* <Link to="/login">Log in</Link> */}
          <Link to="/register">Sign up</Link>
        </>
      )}
    </div>
    );
}
