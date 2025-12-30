/**
 * Application Configuration
 * 
 * This file contains environment-specific configuration.
 * Uses environment variables for API URLs, with fallbacks.
 */

// Get API URL from environment variable or use fallback based on NODE_ENV
const getApiUrl = () => {
  // First priority: explicit REACT_APP_API_URL environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Fallback based on environment
  const isDevelopment =
    process.env.NODE_ENV === 'development' ||
    process.env.REACT_APP_ENV === 'development';

  return isDevelopment
    ? 'http://localhost:5000'
    : 'https://backend-xstc.onrender.com';
};

// Determine current environment
const isDevelopment =
  process.env.NODE_ENV === 'development' ||
  process.env.REACT_APP_ENV === 'development';

const currentEnv = isDevelopment ? 'development' : 'production';

// Export configuration
export const config = {
  url: {
    API_URL: getApiUrl()
  },
  env: currentEnv,
  isDev: isDevelopment,
  CATEGORIES: [
    'Cars',
    'Bikes',
    'Mobiles',
    'Electronics',
    'Appliances',
    'Furniture',
    'Watches',
    'Books',
    'Clothing',
    'Sports'
  ]
};

export default config;
