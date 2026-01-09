import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import { io } from 'socket.io-client';
import { auth } from './firebase';
import { config } from './Constants';
import logger from './utils/logger';

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
    const [favorites, setFavorites] = useState([]); // List of product IDs

    // Modal state
    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    const apiUrl = config.url.API_URL;

    const socketRef = React.useRef(null);
    const [socketConnected, setSocketConnected] = useState(false);

    // Stable refresh function
    const refreshUnreadCount = useCallback(async (uid, tk) => {
        const activeUid = uid || userId;
        const activeTk = tk || token;
        if (!activeUid || !activeTk) return;

        try {
            const res = await axios.get(`${apiUrl}/chatConvo/unread/count`, {
                headers: { Authorization: `Bearer ${activeTk}` }
            });
            if (res.data.success) {
                setUnreadCount(res.data.data.count);
            }
        } catch (error) {
            logger.error('Failed to fetch unread count:', error.message);
        }
    }, [apiUrl, userId, token]); // Fixed dependency array

    // 1. Socket Connection Management (Stable ID)
    useEffect(() => {
        if (isAuth && userId && !socketRef.current) {
            logger.info('Initializing socket connection...');
            socketRef.current = io(apiUrl, {
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
            });

            socketRef.current.on("connect", () => {
                logger.debug('Socket connected successfully');
                socketRef.current.emit("addUser", String(userId));
                setSocketConnected(true);
            });

            socketRef.current.on("disconnect", (reason) => {
                logger.debug('Socket disconnected:', reason);
                setSocketConnected(false);
            });

            socketRef.current.on("connect_error", (err) => {
                logger.error('Socket Connection Error:', err.message);
            });
        }

        return () => {
            if (!isAuth && socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocketConnected(false);
            }
        };
    }, [isAuth, userId, apiUrl]);

    // 2. Global Listener Management
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        // Message Listener
        const handleGetMessage = (data) => {
            logger.info('New message arrival over socket:', data);
            setArrivalMessage(data);
            setUnreadCount(prev => prev + 1);
        };

        socket.on("getMessage", handleGetMessage);

        return () => {
            socket.off("getMessage", handleGetMessage);
        };
    }, [isAuth, userId, socketConnected]);

    // 3. User Registration Enforcer
    useEffect(() => {
        if (isAuth && userId && socketRef.current && socketConnected) {
            socketRef.current.emit("addUser", String(userId));
        }
    }, [isAuth, userId, socketConnected]);

    // Sync user with database
    const syncUserWithDB = useCallback(async (idToken) => {
        try {
            const response = await axios.get(`${apiUrl}/users/me`, {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            if (response.data.success && response.data.data) {
                const dbUser = response.data.data;
                setUser(dbUser);
                setUserId(dbUser._id);
                setFavorites(dbUser.favoriteIds || []);
                await refreshUnreadCount(dbUser._id, idToken);
            } else {
                setUser(null);
                setUserId(null);
            }
        } catch (error) {
            logger.error('User sync error:', error.message);
            setUser(null);
            setUserId(null);
        }
    }, [apiUrl, refreshUnreadCount]);

    // Firebase auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setLoading(true);

            if (fbUser) {
                const idToken = await fbUser.getIdToken();
                setToken(idToken);
                setIsAuth(true);
                await syncUserWithDB(idToken);
            } else {
                setToken(null);
                setUserId(null);
                setUser(null);
                setFavorites([]);
                setIsAuth(false);
                setUnreadCount(0);
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                    setSocketConnected(false);
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [apiUrl, syncUserWithDB]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            setToken(null);
            setUserId(null);
            setUser(null);
            setFavorites([]);
            setIsAuth(false);
            setUnreadCount(0);
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocketConnected(false);
            }
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    }, []);

    // Get auth header for API requests
    const authHeader = useCallback(() => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, [token]);

    // 5. Debounced synchronization for favorites
    const pendingFavoritesRef = React.useRef(new Map()); // Map<productId, { timer, initialIsFavorited }>

    /**
     * Toggles the favorite status of a product with optimized debounced synchronization.
     * Provides instant UI feedback while minimizing backend API pressure.
     * 
     * @param {string} productId - The ID of the product to toggle
     */
    const toggleFavorite = useCallback(async (productId) => {
        if (!isAuth) {
            setOpenSignIn(true);
            return;
        }

        const initialIsFavorited = favorites?.includes(productId);

        // 1. Instant UI Feedback (Optimistic)
        setFavorites(prev => {
            const currentlyFavorited = prev.includes(productId);
            if (currentlyFavorited) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });

        // 2. Debouncing Logic
        if (pendingFavoritesRef.current.has(productId)) {
            clearTimeout(pendingFavoritesRef.current.get(productId).timer);
        } else {
            // First click in a while for this product
            pendingFavoritesRef.current.set(productId, {
                timer: null,
                initialIsFavorited
            });
        }

        const timer = setTimeout(async () => {
            const { initialIsFavorited: originalState } = pendingFavoritesRef.current.get(productId);
            // After the delay, check what the final state in the UI is
            setFavorites(currentFavorites => {
                const finalIsFavorited = currentFavorites.includes(productId);

                // Only call API if the final state is different from the initial state
                if (finalIsFavorited !== originalState) {
                    axios.post(`${apiUrl}/users/favorites/${productId}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(error => {
                        logger.error('Sync favorite error:', error.message);
                        // Revert on serious failure
                        setFavorites(revertPrev => {
                            if (originalState) {
                                return revertPrev.includes(productId) ? revertPrev : [...revertPrev, productId];
                            } else {
                                return revertPrev.filter(id => id !== productId);
                            }
                        });
                    });
                }

                return currentFavorites;
            });

            pendingFavoritesRef.current.delete(productId);
        }, 500); // 500ms debounce window

        pendingFavoritesRef.current.get(productId).timer = timer;
    }, [isAuth, favorites, token, apiUrl]);

    // Context value
    const value = React.useMemo(() => ({
        // Auth state
        isAuth,
        token,
        userId,
        user,
        loading,
        unreadCount,
        socket: socketRef.current,
        arrivalMessage,
        setArrivalMessage,

        // Auth actions
        logout,
        authHeader,
        refreshUnreadCount,
        toggleFavorite,
        favorites,

        // Modal state
        openSignIn,
        setOpenSignIn,
        openSignUp,
        setOpenSignUp
    }), [isAuth, token, userId, user, loading, unreadCount, arrivalMessage, logout, authHeader, refreshUnreadCount, favorites, toggleFavorite, openSignIn, openSignUp]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
