import React, { useState, createContext, useContext,useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export function AuthContextProvider({ children }) {

    //here you have to useEffect and fetch the token from Cookies 
    //now from cookies you have to put that cookie to setToken(token)
  const [token, setToken] = useState(Cookies.get('token'));
  const [isAuth, setIsAuth] = useState(Cookies.get('isAuth'));
  const [userId, setUserId] = useState(Cookies.get('userId'));

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuth(true);
      setIsAuth(true);
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

  const authHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
    return (
        <AuthContext.Provider value={{ isAuth, token, userId, login, logout, authHeader }}>
            {children}
        </AuthContext.Provider>
    );
}
