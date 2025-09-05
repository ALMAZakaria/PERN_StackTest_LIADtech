# Frontend Deployment Guide for Vercel

## Problem Identified
You were experiencing 404 errors and timeouts because:
1. **Backend-only deployment**: Your current Vercel deployment only serves the backend API
2. **Missing frontend deployment**: The frontend React app is not deployed on Vercel
3. **Routing issues**: Direct access to routes like `/missions` fails because there's no frontend to handle them

## Solution

### 1. Deploy Frontend to Vercel

You need to deploy the **frontend** folder separately to Vercel:

#### Option A: Deploy via Vercel CLI
```bash
# Navigate to frontend directory
cd frontend

# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy the frontend
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: skillbridge-frontend (or your preferred name)
# - Directory: ./
# - Override settings? N
```

#### Option B: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository
4. Set **Root Directory** to `frontend`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`
7. Deploy

### 2. Configuration Files Created

I've created the following files to fix your deployment:

#### `frontend/vercel.json`
- Configures Vercel to serve the React app
- Routes API calls to your backend on Render
- Handles client-side routing properly

#### Updated `frontend/package.json`
- Added `vercel-build` script for Vercel deployment

#### Updated `frontend/src/services/api.ts`
- Increased timeout from 10s to 30s
- Added better error handling for timeouts and network issues

### 3. Expected Results

After deploying the frontend:

1. **Frontend URL**: `https://your-frontend-project.vercel.app`
2. **Backend API**: `https://pern-stacktest-liadtech-1.onrender.com/api/v1`
3. **Routes will work**: `/missions`, `/dashboard`, etc.
4. **No more 404 errors**: All routes will serve the React app
5. **No more timeouts**: Increased timeout and better error handling

### 4. Current Architecture

```
┌─────────────────────────────────────┐
│           Vercel Frontend           │
│  https://your-frontend.vercel.app   │
│  - React App                        │
│  - Client-side routing              │
│  - API calls to Render backend      │
└─────────────────┬───────────────────┘
                  │ API calls
                  ▼
┌─────────────────────────────────────┐
│           Render Backend            │
│  https://pern-stacktest-liadtech-1  │
│  .onrender.com/api/v1               │
│  - Express.js API                   │
│  - Database operations              │
└─────────────────────────────────────┘
```

### 5. Testing the Fix

After deployment:

1. Visit your frontend URL
2. Navigate to `/missions` - should work without 404
3. Check browser console for any remaining errors
4. Test API calls to ensure they work properly

### 6. Environment Variables (if needed)

If you need to set environment variables in Vercel:
1. Go to your project settings in Vercel
2. Add environment variables:
   - `NODE_ENV=production`
   - Any other variables your app needs

### 7. Troubleshooting

If you still experience issues:

1. **Check build logs** in Vercel dashboard
2. **Verify API endpoints** are working: `https://pern-stacktest-liadtech-1.onrender.com/api/v1/health`
3. **Check browser console** for specific error messages
4. **Test locally** with `npm run dev` to ensure everything works

## Next Steps

1. Deploy the frontend to Vercel using one of the methods above
2. Update any hardcoded URLs to use your new frontend domain
3. Test all routes and functionality
4. Consider setting up a custom domain if needed

The 404 and timeout issues should be resolved once the frontend is properly deployed!
