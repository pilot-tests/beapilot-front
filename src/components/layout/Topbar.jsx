import { useAuth } from '../../contexts/AuthContext'
import LogoutButton from '../LogoutButton';
import "./Topbar.scss"

export default function Topbar() {
  	const { auth } = useAuth();
    const user = auth.user.name_user;

    return (
      <div className="topbar">
        {user} <LogoutButton />
      </div>
    );
}
