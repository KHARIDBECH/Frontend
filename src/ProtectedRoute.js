import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

const ProtectedRoute = ({ element, setOpenSignIn }) => {
    const { isAuth } = useAuth(); // Access the isAuth state from AuthContext

    if (!isAuth) {
        setOpenSignIn(true); // Open the login modal if not authenticated
        return <Navigate to="/" />; // Optionally redirect to home or stay on the same page
    }

    return element; // Render the protected element if authenticated
};

export default ProtectedRoute;