import { useAuth } from '../../contexts/AuthContext'

export default function Topbar() {
  	const { auth } = useAuth();
    const user = auth.user.name_user;

    return (
      <div className="topbar">
        {user}
      </div>
    );
}
