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

    if (!user.active_subscription) {
        return <Navigate to="/subscribe" />; // Reemplaza '/subscribe' con la ruta a la que quieras dirigir a los usuarios no suscritos.
    }

    return <Outlet/>;
}

export default PrivateRoutes;
