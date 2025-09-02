# API Configuration Guide

This guide explains how to configure your frontend to connect to different backend environments.

## Current Configuration

Your frontend is now configured to use the deployed backend at:
`https://pern-stacktest-liadtech-1.onrender.com/api/v1`

## Environment Configuration

### Production (Deployed Backend)
- **API Base URL**: `https://pern-stacktest-liadtech-1.onrender.com/api/v1`
- **Environment**: Production
- **Status**: ✅ Active

### Development (Local Backend)
- **API Base URL**: `http://localhost:5000/api/v1`
- **Environment**: Development
- **Status**: ⚠️ Requires local backend server

## How to Switch Environments

### Option 1: Use Environment Variables (Recommended)

Create a `.env.local` file in your frontend root directory:

```bash
# For production (deployed backend)
VITE_API_BASE_URL=https://pern-stacktest-liadtech-1.onrender.com/api/v1

# For local development
# VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Option 2: Modify Configuration File

Edit `src/config/environment.ts` to change the default API base URL:

```typescript
export const environment = {
  development: {
    apiBaseUrl: 'http://localhost:5000/api/v1',  // Local backend
    appEnv: 'development'
  },
  production: {
    apiBaseUrl: 'https://pern-stacktest-liadtech-1.onrender.com/api/v1',  // Deployed backend
    appEnv: 'production'
  }
};
```

### Option 3: Build-time Environment

When building for production, Vite automatically uses the production environment:

```bash
# Development build (uses localhost)
npm run dev

# Production build (uses deployed backend)
npm run build
```

## Testing the Connection

1. **Check API Health**: Visit `https://pern-stacktest-liadtech-1.onrender.com/health`
2. **Test Frontend**: Your frontend should now connect to the deployed backend
3. **Check Network Tab**: Verify API calls are going to the correct URL

## Troubleshooting

### If API calls fail:
1. Check if the deployed backend is running
2. Verify CORS settings on the backend
3. Check browser console for errors
4. Ensure the API endpoints match between frontend and backend

### If you need to switch back to local:
1. Set `VITE_API_BASE_URL=http://localhost:5000/api/v1` in `.env.local`
2. Or modify `environment.ts` to use localhost as default
3. Restart your development server

## Current Status

✅ **Frontend configured for deployed backend**
✅ **Environment configuration system in place**
✅ **Easy switching between environments**
✅ **Fallback to production backend by default**
