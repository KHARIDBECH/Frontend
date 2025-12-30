import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import Nav from './Nav';

// Pages
import HomePage from './pages/HomePage/HomePage';
import AdPostPage from './pages/AdPostPage/AdPostPage';
import ItemDetails from './ItemDetails';
import Messenger from './pages/Chat/Messenger';
import Favourites from './components/Favourites';
import AdTabs from './components/AdTabs';
import Category from './pages/Category/Category';
import Profile from './pages/Profile/Profile';

// Auth
import ProtectedRoute from './ProtectedRoute';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/post-ad" element={<ProtectedRoute element={<AdPostPage />} />} />
          <Route path="/item/:productUrl" element={<ProtectedRoute element={<ItemDetails />} />} />
          <Route path="/my-ads/*" element={<ProtectedRoute element={<AdTabs />} />} />
          <Route path="/favourites" element={<ProtectedRoute element={<Favourites />} />} />
          <Route path="/chat" element={<ProtectedRoute element={<Messenger />} />} />

          {/* Category Route - Keep at end to avoid conflicts */}
          <Route path="/:category" element={<ProtectedRoute element={<Category />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
