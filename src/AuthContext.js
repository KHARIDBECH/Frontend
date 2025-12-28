import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import { auth } from './firebase';
import { config } from './Constants';

// Create context
const AuthContext = createContext(null);

// Custom hook for accessing auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};

// Auth Provider Component
export function AuthContextProvider({ children }) {
    // Auth state
    const [token, setToken] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    const apiUrl = config.url.API_URL;

    // Sync user with database
    const syncUserWithDB = async (idToken) => {
        try {
            const response = await axios.get(`${apiUrl}/api/users/me`, {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            if (response.data.success && response.data.data) {
                setUserId(response.data.data._id);
            } else {
                setUserId(null);
            }
        } catch (error) {
            console.error('Failed to sync user with DB:', error.message);
            setUserId(null);
        }
    };

    // Firebase auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            if (user) {
                const idToken = await user.getIdToken();
                setToken(idToken);
                setIsAuth(true);
                await syncUserWithDB(idToken);
            } else {
                setToken(null);
                setUserId(null);
                setIsAuth(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [apiUrl]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            setToken(null);
            setUserId(null);
            setIsAuth(false);
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    }, []);

    // Get auth header for API requests
    const authHeader = useCallback(() => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, [token]);

    // Context value
    const value = {
        // Auth state
        isAuth,
        token,
        userId,
        loading,

        // Auth actions
        logout,
        authHeader,

        // Modal state
        openSignIn,
        setOpenSignIn,
        openSignUp,
        setOpenSignUp
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
