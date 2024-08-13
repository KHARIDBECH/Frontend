import React,{useState, createContext,useContext,useEffect} from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext() ;

export const useAuth = () => useContext(AuthContext)

export function AuthContextProvider({children}) {

//here you have to useEffect and fetch the token from Cookies 
//now from cookies you have to put that cookie to setToken(token)
// const [token, setToken ] =  useState(Cookies.get('Token')); 
const [is_Auth,setAuth]  =  useState(Cookies.get('isAuth'));
const [userId,setuserId]  =  useState(Cookies.get('userId'));
const [token, setToken] = useState(() => Cookies.get('Token'));

useEffect(() => {
  const tokenFromCookies = Cookies.get('Token');
  setToken(tokenFromCookies);
}, []);


    return (
        <AuthContext.Provider value={{ is_Auth,setAuth,token,setToken,userId,setuserId }}>
            {children}
        </AuthContext.Provider>
    );
}
