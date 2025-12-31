import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import Nav from './Nav';

// Auth
import ProtectedRoute from './ProtectedRoute';

// Styles
import './App.css';

// Pages - Lazy Loaded
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AdPostPage = lazy(() => import('./pages/AdPostPage/AdPostPage'));
const ItemDetails = lazy(() => import('./ItemDetails'));
const Messenger = lazy(() => import('./pages/Chat/Messenger'));
const Favourites = lazy(() => import('./components/Favourites'));
const AdTabs = lazy(() => import('./components/AdTabs'));
const Category = lazy(() => import('./pages/Category/Category'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

// Loading Component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    color: 'var(--primary)',
    fontWeight: 600
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/post-ad" element={<ProtectedRoute element={<AdPostPage />} />} />
            <Route path="/item/:id" element={<ProtectedRoute element={<ItemDetails />} />} />
            <Route path="/my-ads/*" element={<ProtectedRoute element={<AdTabs />} />} />
            <Route path="/favourites" element={<ProtectedRoute element={<Favourites />} />} />
            <Route path="/chat" element={<ProtectedRoute element={<Messenger />} />} />

            {/* Category Route - Keep at end to avoid conflicts */}
            <Route path="/:category" element={<ProtectedRoute element={<Category />} />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
