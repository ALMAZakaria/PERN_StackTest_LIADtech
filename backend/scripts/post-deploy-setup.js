#!/usr/bin/env node

/**
 * Post-Deployment Database Setup Script
 * Run this script after deploying to Render to set up your production database
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting post-deployment database setup...');

try {
  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    console.log('⚠️  Warning: Not in production mode. Set NODE_ENV=production to continue.');
    process.exit(1);
  }

  console.log('✅ Production environment detected');

  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');

  // Run database migrations
  console.log('🗄️  Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Database migrations completed');

  // Seed the database (optional)
  const shouldSeed = process.env.SEED_DATABASE === 'true';
  if (shouldSeed) {
    console.log('🌱 Seeding database...');
    execSync('npm run prisma:seed', { stdio: 'inherit' });
    console.log('✅ Database seeded');
  } else {
    console.log('ℹ️  Skipping database seeding (set SEED_DATABASE=true to enable)');
  }

  console.log('🎉 Post-deployment setup completed successfully!');
  console.log('');
  console.log('Your backend is now ready to serve requests.');
  console.log('Health check endpoint: /health');

} catch (error) {
  console.error('❌ Post-deployment setup failed:', error.message);
  console.error('');
  console.error('Troubleshooting tips:');
  console.error('1. Check your DATABASE_URL environment variable');
  console.error('2. Ensure your database is accessible from Render');
  console.error('3. Verify your database user has the necessary permissions');
  console.error('4. Check the Render logs for more details');
  process.exit(1);
}
