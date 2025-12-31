import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { Analytics } from '@vercel/analytics/react';

import { AuthContextProvider } from './AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthContextProvider>
        <App />
        <Analytics />
      </AuthContextProvider>
    </HelmetProvider>
  </React.StrictMode>
);
