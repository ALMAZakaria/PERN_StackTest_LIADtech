// Environment Configuration
export const environment = {
  development: {
    apiBaseUrl: 'http://localhost:5000/api/v1',
    appEnv: 'development'
  },
  production: {
    apiBaseUrl: 'https://pern-stacktest-liadtech-1.onrender.com/api/v1',
    appEnv: 'production'
  }
};

// Get current environment
const currentEnv = import.meta.env.MODE || 'development';
export const config = environment[currentEnv as keyof typeof environment] || environment.development;

// API Base URL with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
