

import React, { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import AdsDetails from './pages/AdPostPage/AdPostPage';
import { AuthContextProvider } from './AuthContext';
import ItemDetails from "./ItemDetails"
import Messenger from "./Messenger"
import Favourites from "../src/components/Favourites"
import "./App.css"
import Nav from './Nav'
import AdTabs from "../src/components/AdTabs"
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
          <Route exact path="/ad"  element={<AdsDetails />}/>
          <Route exact path="/item/:productUrl"  element={<ItemDetails />} />
        
          <Route exact path="/myads/*"  element={<AdTabs />}/> 
          <Route exact path="/favourites"  element={<Favourites />}/> 
          <Route exact path="/chat" element={<Messenger/>}/>
          </Routes>  
        </AuthContextProvider>
      </div>
    </Router>
  );
}

export default App;
