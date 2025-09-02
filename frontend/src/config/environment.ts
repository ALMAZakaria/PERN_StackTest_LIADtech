// Environment Configuration
export const environment = {
  development: {
    apiBaseUrl: 'https://pern-stacktest-liadtech-1.onrender.com', // Changed from localhost to production
    appEnv: 'development'
  },
  production: {
    apiBaseUrl: 'https://pern-stacktest-liadtech-1.onrender.com',
    appEnv: 'production'
  }
};

// Get current environment
const currentEnv = import.meta.env.MODE || 'development';
export const config = environment[currentEnv as keyof typeof environment] || environment.development;

// API Base URL with fallback - Force production URL
export const API_BASE_URL = 'https://pern-stacktest-liadtech-1.onrender.com';
