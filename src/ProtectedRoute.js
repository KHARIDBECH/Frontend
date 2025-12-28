import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Wrapper component that protects routes requiring authentication.
 * Redirects unauthenticated users to the home page and opens the sign-in modal.
 * 
 * @param {Object} props
 * @param {React.ReactElement} props.element - The component to render if authenticated
 * @param {string} [props.redirectTo='/'] - Path to redirect unauthenticated users
 */
const ProtectedRoute = ({ element, redirectTo = '/' }) => {
    const { isAuth, loading, setOpenSignIn } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Only prompt sign in if not authenticated and not loading
        if (!loading && !isAuth) {
            setOpenSignIn(true);
        }
    }, [isAuth, loading, setOpenSignIn]);

    // Show nothing while checking auth status
    if (loading) {
        return null;
    }

    // Redirect to home if not authenticated
    if (!isAuth) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Render protected component
    return element;
};

export default ProtectedRoute;