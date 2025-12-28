import React, { useState, createContext, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedToken = Cookies.get('token');
        const storedIsAuth = Cookies.get('isAuth');
        const storedUserId = Cookies.get('userId');

        if (storedToken) {
            setToken(storedToken);
            setIsAuth(storedIsAuth === 'true');
            setUserId(storedUserId);
        }
    }, []);

    const login = (newToken, newUserId) => {
        setToken(newToken);
        setUserId(newUserId);
        setIsAuth(true);
        Cookies.set('token', newToken, { expires: 7 });
        Cookies.set('isAuth', 'true', { expires: 7 });
        Cookies.set('userId', newUserId, { expires: 7 });
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        setIsAuth(false);
        Cookies.remove('token');
        Cookies.remove('isAuth');
        Cookies.remove('userId');
    };

    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    const authHeader = React.useCallback(() => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, [token]);

    return (
        <AuthContext.Provider value={{
            isAuth, token, userId, login, logout, authHeader,
            openSignIn, setOpenSignIn,
            openSignUp, setOpenSignUp
        }}>
            {children}
        </AuthContext.Provider>
    );
}
