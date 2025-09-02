# Render Deployment Guide for PERN Backend

## Overview
This guide will help you deploy your PERN stack backend on Render.com.

## Prerequisites
- A Render.com account
- Your backend code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Create a New Web Service on Render

1. Log into your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the service as follows:

### 2. Service Configuration

**Basic Settings:**
- **Name**: `pern-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (this is crucial!)

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 3. Environment Variables

Set these environment variables in your Render service:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_URL=your_redis_connection_string
```

**Important Notes:**
- `DATABASE_URL`: Use a production PostgreSQL database (Render provides one)
- `JWT_SECRET`: Generate a strong, random secret
- `REDIS_URL`: Use a production Redis instance (Render provides one)

### 4. Database Setup

1. **Create a PostgreSQL Database on Render:**
   - Go to "New +" → "PostgreSQL"
   - Choose your plan
   - Note the connection details

2. **Update Environment Variables:**
   - Copy the PostgreSQL connection string to `DATABASE_URL`
   - Copy the Redis connection string to `REDIS_URL`

3. **Run Database Migrations:**
   - After deployment, you may need to run:
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

### 5. Health Check

Your service includes multiple health check endpoints:
- `/health` - Basic health status
- `/status` - Service status for monitoring (used by Render)
- `/` - Root endpoint with API information

Render will use the `/status` endpoint to monitor your service.

### 6. Deployment

1. Click "Create Web Service"
2. Render will automatically build and deploy your service
3. Monitor the build logs for any errors
4. Once deployed, your service will be available at the provided URL

## Troubleshooting

### Common Issues

1. **"Could not read package.json" Error:**
   - Ensure "Root Directory" is set to `backend`
   - Verify your repository structure

2. **Build Failures:**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation works locally

3. **Database Connection Issues:**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from Render's network

4. **Port Issues:**
   - Render automatically sets the `PORT` environment variable
   - Your app should use `process.env.PORT`

### Build Logs

Monitor the build logs in Render dashboard for detailed error information.

## Post-Deployment

1. **Test Your API:**
   - Visit `https://your-service.onrender.com/` (root endpoint)
   - Visit `https://your-service.onrender.com/health` (health check)
   - Visit `https://your-service.onrender.com/status` (status check)
   - Test your main endpoints

2. **Monitor Performance:**
   - Use Render's built-in monitoring
   - Check logs for any runtime errors

3. **Set Up Custom Domain (Optional):**
   - Configure your custom domain in Render settings

## Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data to Git
   - Use Render's environment variable management

2. **Database Security:**
   - Use strong passwords
   - Restrict database access to your service only

3. **API Security:**
   - Implement proper authentication
   - Use HTTPS (Render provides this automatically)

## Support

If you encounter issues:
1. Check Render's documentation
2. Review build and runtime logs
3. Verify your configuration matches this guide
4. Contact Render support if needed

## Repository Structure

Your repository should look like this:
```
/
├── backend/           # Root directory for Render
│   ├── package.json
│   ├── src/
│   ├── prisma/
│   └── ...
├── frontend/
├── render.yaml        # Render configuration
└── .render-buildpacks
```

The `render.yaml` file in your root directory will help Render understand your project structure.
