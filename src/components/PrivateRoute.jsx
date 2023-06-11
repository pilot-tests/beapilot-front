import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PrivateRoutes = () => {
    const { auth } = useAuth()
    const { token, user } = auth;
    console.log(token)
    return(
        token ? <Outlet/> : <Navigate to="/logedout"/>
    )
}

export default PrivateRoutes
