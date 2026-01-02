import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import { io } from 'socket.io-client';
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
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = React.useRef(null);

    // Modal state
    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    const apiUrl = config.url.API_URL;

    // Refresh unread count
    const refreshUnreadCount = useCallback(async (currentId, idToken) => {
        const uid = currentId || userId;
        const tk = idToken || token;
        if (!uid || !tk) return;

        try {
            const res = await axios.get(`${apiUrl}/api/chatConvo/unread/count`, {
                headers: { Authorization: `Bearer ${tk}` }
            });
            if (res.data.success) {
                setUnreadCount(res.data.data.count);
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error.message);
        }
    }, [apiUrl, userId, token]);

    // Sync user with database
    const syncUserWithDB = async (idToken) => {
        try {
            const response = await axios.get(`${apiUrl}/api/users/me`, {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            if (response.data.success && response.data.data) {
                setUser(response.data.data);
                const uid = response.data.data._id;
                setUserId(uid);
                // Also fetch unread count here
                await refreshUnreadCount(uid, idToken);
            } else {
                setUser(null);
                setUserId(null);
            }
        } catch (error) {
            console.error('Failed to sync user with DB:', error.message);
            setUser(null);
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
                setUser(null);
                setIsAuth(false);
                setUnreadCount(0);
                if (socket.current) {
                    socket.current.disconnect();
                    socket.current = null;
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [apiUrl]);

    // Socket Setup
    useEffect(() => {
        if (isAuth && userId) {
            if (!socket.current) {
                socket.current = io(apiUrl);
                socket.current.emit("addUser", userId);

                socket.current.on("getMessage", (data) => {
                    setArrivalMessage({
                        senderId: data.senderId,
                        text: data.text,
                        createdAt: Date.now(),
                    });
                    // Global unread increment
                    setUnreadCount(prev => prev + 1);
                });
            }
        }
    }, [isAuth, userId, apiUrl]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            setToken(null);
            setUserId(null);
            setUser(null);
            setIsAuth(false);
            setUnreadCount(0);
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    }, []);

    // Get auth header for API requests
    const authHeader = useCallback(() => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, [token]);

    // Context value
    const value = React.useMemo(() => ({
        // Auth state
        isAuth,
        token,
        userId,
        user,
        loading,
        unreadCount,
        socket: socket.current,
        arrivalMessage,
        setArrivalMessage,

        // Auth actions
        logout,
        authHeader,
        refreshUnreadCount,

        // Modal state
        openSignIn,
        setOpenSignIn,
        openSignUp,
        setOpenSignUp
    }), [isAuth, token, userId, user, loading, unreadCount, arrivalMessage, logout, authHeader, refreshUnreadCount, openSignIn, openSignUp]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
