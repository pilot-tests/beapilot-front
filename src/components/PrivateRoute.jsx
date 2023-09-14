import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessContext from '../contexts/AccessContext';

const PrivateRoutes = () => {
    const { auth, loading } = useAuth();
    const { token, user } = auth;
    const [accessStatus, setAccessStatus] = useState("loading");

    useEffect(() => {
        if (user && user.active_subscription !== "active") {
            setAccessStatus("inactiveSubscription");
        } else {
            setAccessStatus("active");
        }
    }, [user]);


    if (loading) {
        return <div>Loading...</div>; // O tu componente de carga aquí.
    }

    if (!token) {
        return <Navigate to="/logedout" />;
    }

    return (
        <AccessContext.Provider value={accessStatus}>
            <Outlet />
        </AccessContext.Provider>
    );
}

export default PrivateRoutes;
