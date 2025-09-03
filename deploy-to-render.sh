#!/bin/bash

# Render Deployment Script for PERN Backend
# This script helps prepare your project for Render deployment

echo "🚀 Preparing PERN Backend for Render Deployment..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: backend/package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "✅ Project structure verified"

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found!"
    echo "Please ensure render.yaml is in the root directory."
    exit 1
fi

echo "✅ Render configuration found"

# Check if .render-buildpacks exists
if [ ! -f ".render-buildpacks" ]; then
    echo "❌ Error: .render-buildpacks not found!"
    echo "Please ensure .render-buildpacks is in the root directory."
    exit 1
fi

echo "✅ Buildpacks configuration found"

# Test backend build locally
echo "🔨 Testing backend build locally..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Test TypeScript compilation
echo "🔧 Testing TypeScript compilation..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Backend builds successfully"
else
    echo "❌ Backend build failed! Please fix the issues before deploying."
    exit 1
fi

cd ..

echo ""
echo "🎉 Your project is ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to your Git repository"
echo "2. Go to render.com and create a new Web Service"
echo "3. Connect your repository"
echo "4. Set Root Directory to: backend"
echo "5. Set Build Command to: npm install && npm run build"
echo "6. Set Start Command to: npm start"
echo "7. Configure environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - DATABASE_URL=your_postgresql_connection_string"
echo "   - JWT_SECRET=your_jwt_secret_key"
echo "   - REDIS_URL=your_redis_connection_string"
echo ""
echo "📚 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
