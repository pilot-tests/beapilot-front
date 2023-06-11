import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PrivateRoutes = () => {
    const { auth, loading } = useAuth()
    const { token, user } = auth;

    if (loading) {
      return <div>Loading...</div>; // O tu componente de carga aquí.
    }

    return(
        token ? <Outlet/> : <Navigate to="/logedout"/>
    )
}


export default PrivateRoutes
