import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PrivateRoutes = () => {
    const { auth: { token, user }, setToken, setUser } = useAuth();
    return (
        token ? <Outlet/> : <Navigate to="/"/>
    );
}

export default PrivateRoutes;
