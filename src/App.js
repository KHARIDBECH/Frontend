import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import AdsDetails from './pages/AdPostPage/AdPostPage';
import ItemDetails from "./ItemDetails"
import Messenger from "./pages/Chat/Messenger"
import Favourites from "../src/components/Favourites"
import "./App.css"
import Nav from './Nav'
import AdTabs from "../src/components/AdTabs"
import Category from "./pages/Category/Category";
import ProtectedRoute from "./ProtectedRoute";

function App() {

  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/:category" element={<ProtectedRoute element={<Category />} />} />
          <Route exact path="/Product" element={<ProtectedRoute element={<AdsDetails />} />} />
          <Route exact path="/item/:productUrl" element={<ProtectedRoute element={<ItemDetails />} />} />
          <Route exact path="/myads/*" element={<ProtectedRoute element={<AdTabs />} />} />
          <Route exact path="/favourites" element={<ProtectedRoute element={<Favourites />} />} />
          <Route exact path="/chat" element={<ProtectedRoute element={<Messenger />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
