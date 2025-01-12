import React, { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import AdsDetails from './pages/AdPostPage/AdPostPage';
import { AuthContextProvider } from './AuthContext';
import ItemDetails from "./ItemDetails"
import Messenger from "./pages/Chat/Messenger"
import Favourites from "../src/components/Favourites"
import "./App.css"
import Nav from './Nav'
import AdTabs from "../src/components/AdTabs"
import Category from "./pages/Category/Category";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  const [openSignIn, setopenSignIn] = useState(false)
  const [openSignUp, setopenSignUp] = useState(false)


  return (
    <Router>
      <div className="App">
        <AuthContextProvider>
          <Nav openSignIn={openSignIn} setopenSignIn={setopenSignIn} openSignUp={openSignUp} setopenSignUp={setopenSignUp} />
          <Routes>
            <Route exact path="/" element={<HomePage />}/>
          <Route exact path="/:category"  element={<ProtectedRoute element={<Category />} setOpenSignIn={setopenSignIn}/>} />
          <Route exact path="/Product"  element={<ProtectedRoute element={<AdsDetails />} setOpenSignIn={setopenSignIn}/>}/>
          <Route exact path="/item/:productUrl"  element={<ProtectedRoute element={<ItemDetails />} setOpenSignIn={setopenSignIn}/>} />

        
          <Route exact path="/myads/*"  element={<ProtectedRoute element={<AdTabs />} setOpenSignIn={setopenSignIn}/>}/> 
          <Route exact path="/favourites"  element={<ProtectedRoute element={<Favourites />} setOpenSignIn={setopenSignIn}/>}/> 
          <Route exact path="/chat" element={<ProtectedRoute element={<Messenger/>} setOpenSignIn={setopenSignIn}/>}/>
          </Routes>  
        </AuthContextProvider>
      </div>
    </Router>
  );
}

export default App;
