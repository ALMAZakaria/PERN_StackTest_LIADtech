# Migration Guide: Simple API to Database

This guide will help you transition from the simple in-memory API to the full database-powered backend.

## 🔄 Overview

The simple API (`simple-api.ts`) uses in-memory data storage, while the main application uses PostgreSQL with Prisma ORM. This migration provides:

- **Persistent data storage**
- **Better security**
- **Scalability**
- **Data integrity**
- **Advanced features**

## 📋 Prerequisites

1. **PostgreSQL Database**
   ```bash
   # Install PostgreSQL (Ubuntu/Debian)
   sudo apt-get install postgresql postgresql-contrib
   
   # Install PostgreSQL (macOS)
   brew install postgresql
   
   # Install PostgreSQL (Windows)
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE skillbridge_db;
   CREATE USER skillbridge_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE skillbridge_db TO skillbridge_user;
   ```

## 🚀 Migration Steps

### Step 1: Environment Setup

1. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

2. **Configure database connection**
   ```env
   DATABASE_URL="postgresql://skillbridge_user:your_password@localhost:5432/skillbridge_db"
   ```

3. **Set JWT secrets**
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
   ```

### Step 2: Database Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

3. **Run migrations**
   ```bash
   npm run prisma:migrate
   ```

4. **Setup demo data**
   ```bash
   npm run db:setup
   ```

### Step 3: Start the Application

1. **Stop simple API** (if running)
   ```bash
   # Stop the simple API server
   # Ctrl+C if running npm run dev:simple
   ```

2. **Start main server**
   ```bash
   npm run dev
   ```

3. **Verify setup**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # API documentation
   open http://localhost:5000/api-docs
   ```

## 🔐 Authentication Changes

### JWT Token Structure

**Before (Simple API):**
```json
{
  "userId": "1",
  "role": "user"
}
```

**After (Database):**
```json
{
  "userId": "clx1234567890",
  "email": "user@example.com",
  "role": "USER",
  "userType": "FREELANCER"
}
```

### Login Response

**Before:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token"
  }
}
```

**After:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "access_token",
    "refreshToken": "refresh_token"
  }
}
```

## 📊 Data Structure Changes

### User Model

**Before (In-Memory):**
```javascript
{
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password',
  role: 'user',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**After (Database):**
```sql
-- Users table
id: cuid() // Auto-generated
email: string (unique)
password: string (hashed)
firstName: string
lastName: string
role: enum (USER, ADMIN)
userType: enum (FREELANCER, COMPANY)
isActive: boolean
createdAt: timestamp
updatedAt: timestamp

-- Related profiles
freelance_profiles: FreelanceProfile[]
company_profiles: CompanyProfile[]
```

### Mission Model

**Before (In-Memory):**
```javascript
{
  id: '1',
  companyId: '1',
  title: 'Frontend Developer Needed',
  description: '...',
  requiredSkills: ['React', 'TypeScript'],
  budget: 5000,
  duration: 30,
  location: 'Remote',
  isRemote: true,
  status: 'OPEN'
}
```

**After (Database):**
```sql
-- Missions table
id: cuid()
title: string
description: text
requiredSkills: string[]
budget: decimal(10,2)
duration: integer
location: string?
isRemote: boolean
status: enum (OPEN, IN_PROGRESS, COMPLETED, CANCELLED, EXPIRED)
urgency: enum (LOW, NORMAL, HIGH, URGENT)
companyId: string (foreign key)
createdAt: timestamp
updatedAt: timestamp
```

## 🔄 API Endpoint Changes

### Authentication Endpoints

| Endpoint | Simple API | Database API | Changes |
|----------|------------|--------------|---------|
| `POST /api/v1/auth/register` | ✅ | ✅ | Enhanced validation, profile creation |
| `POST /api/v1/auth/login` | ✅ | ✅ | Refresh token added |
| `POST /api/v1/auth/logout` | ✅ | ✅ | Token blacklisting (optional) |

### User Management

| Endpoint | Simple API | Database API | Changes |
|----------|------------|--------------|---------|
| `GET /api/v1/users` | ✅ | ✅ | Pagination, filtering |
| `GET /api/v1/users/:id` | ✅ | ✅ | Enhanced user data |
| `POST /api/v1/users/create` | ✅ | ✅ | Profile creation |
| `PUT /api/v1/users/:id` | ✅ | ✅ | Profile updates |
| `DELETE /api/v1/users/:id` | ✅ | ✅ | Cascade deletion |

### New Endpoints (Database Only)

- `GET /api/v1/freelance/profile` - Get freelancer profile
- `PUT /api/v1/freelance/profile` - Update freelancer profile
- `GET /api/v1/company/profile` - Get company profile
- `PUT /api/v1/company/profile` - Update company profile
- `GET /api/v1/portfolio/projects` - Get portfolio projects
- `POST /api/v1/portfolio/projects` - Create portfolio project

## 🛠️ Frontend Migration

### Update API Base URL

**Before:**
```javascript
const API_BASE_URL = 'http://localhost:5000/api/v1';
```

**After:**
```javascript
const API_BASE_URL = 'http://localhost:5000/api/v1';
// No change needed - same endpoint structure
```

### Update Authentication

**Before:**
```javascript
// Store token
localStorage.setItem('token', response.data.token);

// Use token
const token = localStorage.getItem('token');
```

**After:**
```javascript
// Store both tokens
localStorage.setItem('accessToken', response.data.token);
localStorage.setItem('refreshToken', response.data.refreshToken);

// Use access token
const token = localStorage.getItem('accessToken');

// Handle token refresh
const refreshToken = localStorage.getItem('refreshToken');
```

### Update User Data Structure

**Before:**
```javascript
const user = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};
```

**After:**
```javascript
const user = {
  id: 'clx1234567890',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'USER',
  userType: 'FREELANCER',
  profile: {
    skills: ['React', 'TypeScript'],
    dailyRate: 150.00,
    experience: 3
  }
};
```

## 🔍 Testing the Migration

### 1. Test Authentication

```bash
# Register new user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "userType": "FREELANCER"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Protected Endpoints

```bash
# Get user profile (use token from login)
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test Demo Credentials

```bash
# Admin login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "demo123"
  }'
```

## 🚨 Common Issues & Solutions

### 1. Database Connection Failed

**Error:** `ECONNREFUSED` or `ENOTFOUND`

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection
psql -h localhost -U skillbridge_user -d skillbridge_db
```

### 2. Migration Failed

**Error:** `P3009` or `P3014`

**Solution:**
```bash
# Reset database
npm run db:reset

# Or manually
npx prisma migrate reset --force
npm run db:setup
```

### 3. JWT Token Issues

**Error:** `JsonWebTokenError` or `TokenExpiredError`

**Solution:**
```bash
# Check JWT secrets in .env
echo $JWT_SECRET

# Regenerate secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
```

### 4. CORS Issues

**Error:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Solution:**
```env
# Update .env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

## 📊 Performance Comparison

| Metric | Simple API | Database API |
|--------|------------|--------------|
| **Data Persistence** | ❌ In-memory | ✅ PostgreSQL |
| **Concurrent Users** | ~10-50 | 1000+ |
| **Data Size** | Limited by RAM | Limited by disk |
| **Backup/Restore** | ❌ Manual | ✅ Automated |
| **Scalability** | ❌ Single instance | ✅ Multi-instance |
| **Security** | ⚠️ Basic | ✅ Advanced |

## 🔄 Rollback Plan

If you need to rollback to the simple API:

1. **Stop database server**
   ```bash
   npm run dev
   # Ctrl+C
   ```

2. **Start simple API**
   ```bash
   npm run dev:simple
   ```

3. **Update frontend** (if needed)
   - Remove refresh token handling
   - Update user data structure

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Express.js Security](https://expressjs.com/en/advanced/best-practices-security.html)

## 🆘 Support

If you encounter issues during migration:

1. Check the logs: `tail -f logs/combined.log`
2. Verify database connection: `npm run prisma:studio`
3. Test individual endpoints with curl
4. Review the error handling in `src/middleware/error.middleware.ts`
5. Create an issue in the repository with detailed error information
