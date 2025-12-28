/**
 * Application Configuration
 * 
 * This file contains environment-specific configuration.
 * Uses REACT_APP_ENV or NODE_ENV to determine the environment.
 */

const environments = {
  production: {
    API_URL: 'https://backend-1-q12v.onrender.com'
  },
  development: {
    API_URL: 'http://localhost:5000'
  }
};

// Determine current environment
const isDevelopment =
  process.env.NODE_ENV === 'development' ||
  process.env.REACT_APP_ENV === 'development';

const currentEnv = isDevelopment ? 'development' : 'production';

// Export configuration
export const config = {
  url: environments[currentEnv],
  env: currentEnv,
  isDev: isDevelopment
};

export default config;
