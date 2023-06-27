import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoutes = () => {
    const { auth, loading } = useAuth();
    const { token, user } = auth;

    if (loading) {
        return <div>Loading...</div>; // O tu componente de carga aquí.
    }

    if (!token) {
        return <Navigate to="/logedout" />;
    }

    if (user.active_subscription != "active") {
        return <Navigate to="/subscribe" />;
    }

    return <Outlet/>;
}

export default PrivateRoutes;
