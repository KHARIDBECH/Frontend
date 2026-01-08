import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Skeleton, Box, Container } from '@mui/material';
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

    // Show skeleton while checking auth status
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={300} height={20} />
                </Box>
                <Box sx={{ p: 4, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', bgcolor: 'rgba(255,255,255,0.5)' }}>
                    <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '16px', mb: 3 }} />
                    <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={20} />
                </Box>
            </Container>
        );
    }

    // Redirect to home if not authenticated
    if (!isAuth) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Render protected component
    return element;
};

export default ProtectedRoute;