# Production Deployment Guide

## Overview
This guide covers deploying your PERN Stack application to production with the domain `https://pern-stack-test-lia-dtech-vg4f.vercel.app`.

## Domain Configuration

### Backend Configuration
The backend has been updated to work with the production domain:

- **CORS Origin**: `https://pern-stack-test-lia-dtech-vg4f.vercel.app,http://localhost:3000`
- **API Base URL**: `https://pern-stack-test-lia-dtech-vg4f.vercel.app/api/v1`
- **Swagger Documentation**: `https://pern-stack-test-lia-dtech-vg4f.vercel.app/api-docs`

### Frontend Configuration
The frontend has been updated to use the production API:

- **API Base URL**: `https://pern-stack-test-lia-dtech-vg4f.vercel.app/api/v1`
- **Development Fallback**: `http://localhost:5000/api/v1` (for local development)

## Environment Variables

### Backend (.env)
```bash
# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL="your-production-database-url"

# Redis
REDIS_URL=your-production-redis-url
REDIS_PASSWORD=your-redis-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=https://pern-stack-test-lia-dtech-vg4f.vercel.app,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# API Documentation
SWAGGER_ENABLED=true

# Security
BCRYPT_ROUNDS=12
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_BASE_URL=https://pern-stack-test-lia-dtech-vg4f.vercel.app/api/v1

# App Configuration
VITE_APP_NAME=PERN Stack App
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

## Deployment Steps

### 1. Backend Deployment (Vercel)

1. **Build the backend**:
   ```bash
   cd backend
   npm run build
   ```

2. **Deploy to Vercel**:
   - The `vercel.json` file is already configured
   - Ensure environment variables are set in Vercel dashboard
   - Deploy using Vercel CLI or GitHub integration

3. **Verify deployment**:
   ```bash
   curl https://pern-stack-test-lia-dtech-vg4f.vercel.app/health
   ```

### 2. Frontend Deployment

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to your hosting platform**:
   - Vercel, Netlify, or any static hosting service
   - Ensure the production environment variables are set

### 3. Database Setup

1. **Production Database**:
   - Use a production PostgreSQL instance
   - Update `DATABASE_URL` in backend environment
   - Run migrations: `npm run prisma:migrate`

2. **Redis Setup**:
   - Use a production Redis instance
   - Update `REDIS_URL` in backend environment

## Configuration Files Updated

### Backend
- `src/config/server.ts` - CORS origin updated
- `src/app.ts` - CORS handling improved, Swagger servers updated
- `vercel.json` - Production routing and environment variables

### Frontend
- `src/services/api.ts` - Production API URL as default
- `vite.config.ts` - Development proxy commented out
- `docker-compose.yml` - Production URLs updated

## Testing Production Deployment

### 1. Health Check
```bash
curl https://pern-stack-test-lia-dtech-vg4f.vercel.app/health
```

### 2. API Documentation
```bash
open https://pern-stack-test-lia-dtech-vg4f.vercel.app/api-docs
```

### 3. CORS Test
```bash
curl -H "Origin: https://pern-stack-test-lia-dtech-vg4f.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://pern-stack-test-lia-dtech-vg4f.vercel.app/api/v1/users
```

## Troubleshooting

### CORS Issues
- Check that the frontend domain is included in `CORS_ORIGIN`
- Verify environment variables are set correctly
- Check browser console for CORS errors

### API Connection Issues
- Verify the production API URL is correct
- Check that the backend is deployed and accessible
- Test with curl or Postman

### Environment Variables
- Ensure all required environment variables are set
- Check for typos in variable names
- Verify values are properly quoted

## Security Considerations

1. **JWT Secrets**: Use strong, unique secrets in production
2. **Database**: Use production-grade database with proper security
3. **HTTPS**: Ensure all production endpoints use HTTPS
4. **Rate Limiting**: Production rate limits are configured
5. **CORS**: Only allow necessary origins

## Monitoring

1. **Health Checks**: Monitor `/health` endpoint
2. **Logs**: Check application logs for errors
3. **Performance**: Monitor API response times
4. **Errors**: Set up error tracking and alerting

## Rollback Plan

1. **Backend**: Revert to previous Vercel deployment
2. **Frontend**: Revert to previous frontend deployment
3. **Database**: Use database backups if needed
4. **Environment**: Revert environment variable changes

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test endpoints individually
4. Check CORS configuration
5. Review application logs
