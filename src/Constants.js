// Determine current environment
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENV === 'development';
const currentEnv = isDevelopment ? 'development' : 'production';

// Export configuration
export const config = {
  url: {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'
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
