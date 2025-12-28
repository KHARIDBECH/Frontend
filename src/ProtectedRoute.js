import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
    const { isAuth, setOpenSignIn } = useAuth();

    useEffect(() => {
        if (!isAuth) {
            setOpenSignIn(true);
        }
    }, [isAuth, setOpenSignIn]);

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default ProtectedRoute;