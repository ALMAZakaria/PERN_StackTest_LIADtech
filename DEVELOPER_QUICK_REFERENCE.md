# SkillBridge Developer Quick Reference

## 🚀 Quick Start Commands

### Docker Setup (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Manual Setup
```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 📁 Key File Locations

### Backend
- **Main App**: `backend/src/app.ts`
- **Server Entry**: `backend/src/server.ts`
- **Database Schema**: `backend/prisma/schema.prisma`
- **Environment**: `backend/.env`
- **Package Config**: `backend/package.json`

### Frontend
- **Main App**: `frontend/src/App.tsx`
- **Router**: `frontend/src/router/router.tsx`
- **Store**: `frontend/src/state/store.ts`
- **Environment**: `frontend/.env`
- **Package Config**: `frontend/package.json`

## 🔧 Development Commands

### Backend Commands
```bash
cd backend

# Development
npm run dev                    # Start dev server with hot reload
npm run dev:simple            # Start simple API server

# Database
npm run prisma:generate       # Generate Prisma client
npm run prisma:migrate        # Run migrations
npm run prisma:seed           # Seed database
npm run prisma:studio         # Open Prisma Studio
npm run db:reset              # Reset and seed database

# Testing
npm test                      # Run all tests
npm run test:watch            # Run tests in watch mode
npm run test:coverage         # Run tests with coverage
npm run test:auth             # Run auth tests only

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix              # Fix ESLint issues
npm run format                # Format with Prettier

# Build
npm run build                 # Build TypeScript
npm start                     # Start production server
```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev                   # Start dev server
npm run preview               # Preview production build

# Testing
npm test                      # Run tests
npm run test:ui               # Run tests with UI
npm run test:coverage         # Run tests with coverage

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix              # Fix ESLint issues
npm run format                # Format with Prettier
npm run type-check            # Type check without emitting

# Build
npm run build                 # Build for production
```

## 🗄️ Database Operations

### Prisma Commands
```bash
cd backend

# Generate client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset

# Open database GUI
npx prisma studio

# Seed database
npx prisma db seed
```

### Database URLs
- **Development**: `postgresql://postgres:postgres123@localhost:5432/pern_db`
- **pgAdmin**: http://localhost:8080 (admin@example.com / admin123)
- **Redis Commander**: http://localhost:8081

## 🔐 Authentication & Authorization

### User Roles
- `USER` - Basic user
- `ADMIN` - Full system access
- `MODERATOR` - User management access

### User Types
- `FREELANCER` - Can apply to missions
- `COMPANY` - Can post missions

### JWT Tokens
- **Access Token**: 7 days
- **Refresh Token**: 30 days
- **Secret**: Set in `JWT_SECRET` environment variable

## 📡 API Endpoints

### Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Documentation**: `http://localhost:5000/api-docs`

### Key Endpoints
```bash
# Authentication
POST /auth/register          # Register user
POST /auth/login             # Login
POST /auth/refresh           # Refresh token
POST /auth/logout            # Logout

# Users
GET /users/profile           # Get user profile
PUT /users/profile           # Update profile

# Missions
GET /missions                # List missions
POST /missions               # Create mission
GET /missions/:id            # Get mission details
PUT /missions/:id            # Update mission
DELETE /missions/:id         # Delete mission

# Applications
GET /applications            # List applications
POST /applications           # Submit application
GET /applications/:id        # Get application details
PUT /applications/:id        # Update application

# Freelance
GET /freelance/profile       # Get freelance profile
POST /freelance/profile      # Create freelance profile
PUT /freelance/profile       # Update freelance profile

# Company
GET /company/profile         # Get company profile
POST /company/profile        # Create company profile
PUT /company/profile         # Update company profile
```

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run specific test files
npm test src/tests/auth.test.ts
npm test src/tests/applications.test.ts

# Run tests with specific pattern
npm test -- --testNamePattern="login"

# Run tests with verbose output
npm test -- --verbose
```

### Frontend Testing
```bash
cd frontend

# Run specific test files
npm test src/components/Header.test.tsx

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage
```

## 🐛 Debugging

### Backend Debugging
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# View logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log

# Debug with Node.js inspector
node --inspect -r ts-node/register src/server.ts
```

### Frontend Debugging
```bash
# Enable React DevTools
# Install React Developer Tools browser extension

# Debug Redux state
# Use Redux DevTools browser extension

# Debug API calls
# Check Network tab in browser DevTools
```

## 🔄 Common Development Workflows

### Adding a New Feature
1. Create feature branch: `git checkout -b feature/new-feature`
2. Add backend module in `backend/src/modules/`
3. Add frontend components in `frontend/src/components/`
4. Add routes in `frontend/src/router/router.tsx`
5. Write tests for both backend and frontend
6. Update documentation
7. Create pull request

### Database Schema Changes
1. Update `backend/prisma/schema.prisma`
2. Generate Prisma client: `npm run prisma:generate`
3. Create migration: `npm run prisma:migrate`
4. Update seed data if needed: `backend/prisma/seed.ts`
5. Test with Prisma Studio: `npm run prisma:studio`

### API Changes
1. Update controller in `backend/src/modules/*/controller/`
2. Update service in `backend/src/modules/*/service/`
3. Update repository in `backend/src/modules/*/repository/`
4. Update DTOs in `backend/src/modules/*/dto/`
5. Update frontend service in `frontend/src/services/`
6. Update frontend components to use new API

## 📝 Code Style Guidelines

### TypeScript
- Use strict mode
- Prefer interfaces over types for objects
- Use enums for constants
- Add JSDoc comments for public APIs

### React
- Use functional components with hooks
- Prefer TypeScript over PropTypes
- Use React.memo for performance optimization
- Follow React naming conventions

### Express
- Use async/await over callbacks
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Follow RESTful conventions

## 🚨 Common Issues & Solutions

### Backend Issues
```bash
# Port already in use
lsof -ti:5000 | xargs kill -9

# Database connection issues
npm run prisma:generate
npm run prisma:migrate

# JWT token issues
# Check JWT_SECRET in .env file
# Clear browser localStorage
```

### Frontend Issues
```bash
# Port already in use
lsof -ti:3000 | xargs kill -9

# Build issues
rm -rf node_modules package-lock.json
npm install

# TypeScript errors
npm run type-check
```

### Docker Issues
```bash
# Container not starting
docker-compose down
docker-compose up -d

# Database not accessible
docker-compose exec postgres psql -U postgres -d pern_db

# Clear all containers and volumes
docker-compose down -v
docker system prune -a
```

## 📚 Useful Resources

### Documentation
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs/)

### Tools
- **API Testing**: Postman, Insomnia
- **Database**: pgAdmin, DBeaver
- **Redis**: Redis Commander, RedisInsight
- **Code Quality**: ESLint, Prettier
- **Git**: GitKraken, SourceTree

---

**Happy Coding! 🎉**
