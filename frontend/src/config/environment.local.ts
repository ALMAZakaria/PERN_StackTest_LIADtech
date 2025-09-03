// Local Development Environment Configuration
// Copy this file to environment.ts and modify as needed for local development

export const environment = {
  development: {
    apiBaseUrl: 'https://pern-stacktest-liadtech-1.onrender.com/api/v1', // Updated to production
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
