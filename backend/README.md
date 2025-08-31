# PERN Stack Backend

A robust, production-ready backend API built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Database Integration**: Prisma ORM with PostgreSQL
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston logger with file and console output
- **Error Handling**: Comprehensive error handling middleware
- **Testing**: Jest testing framework with supertest
- **TypeScript**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for caching)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Setup demo data
   npm run db:setup
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/skillbridge_db"

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# API Documentation
SWAGGER_ENABLED=true

# Security
BCRYPT_ROUNDS=12
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Simple API Mode (Legacy)
```bash
npm run dev:simple
```

## 📚 API Documentation

Once the server is running, you can access the API documentation at:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Demo Credentials
- **Admin**: `admin@demo.com` / `demo123`
- **Freelancer**: `john@example.com` / `demo123`
- **Company**: `techcorp@example.com` / `demo123`

## 🗄️ Database Schema

The application uses Prisma ORM with the following main entities:

- **User**: Core user information and authentication
- **FreelanceProfile**: Freelancer-specific profile data
- **CompanyProfile**: Company-specific profile data
- **Mission**: Job postings by companies
- **Application**: Freelancer applications for missions
- **Rating**: User ratings and reviews
- **PortfolioProject**: Freelancer portfolio projects

## 🔄 Migration from Simple API

### What Changed

1. **Database Integration**: Replaced in-memory data with PostgreSQL database
2. **Authentication**: Enhanced JWT implementation with refresh tokens
3. **Middleware**: Improved security and validation middleware
4. **Error Handling**: Comprehensive error handling with proper HTTP status codes
5. **Logging**: Structured logging with Winston

### Migration Steps

1. **Stop the simple API server**
   ```bash
   # If running simple API
   npm run dev:simple
   ```

2. **Setup database**
   ```bash
   npm run db:setup
   ```

3. **Start the main server**
   ```bash
   npm run dev
   ```

4. **Update frontend API endpoints** (if needed)
   - The API structure remains the same
   - Authentication tokens are now more secure
   - Response format is consistent

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:auth
npm run test:api
```

### Test Structure
- `src/tests/`: Test files
- `src/simple-api.test.ts`: Simple API tests
- `jest.config.js`: Jest configuration

## 📁 Project Structure

```
src/
├── app.ts                 # Main application setup
├── server.ts             # Server entry point
├── config/               # Configuration files
│   ├── server.ts         # Server configuration
│   ├── prisma.ts         # Prisma client setup
│   └── redis.ts          # Redis client setup
├── middleware/           # Express middleware
│   ├── auth.middleware.ts    # Authentication middleware
│   ├── error.middleware.ts   # Error handling middleware
│   ├── logger.middleware.ts  # Logging middleware
│   └── validation.middleware.ts # Request validation
├── modules/              # Feature modules
│   ├── auth/             # Authentication module
│   ├── user/             # User management
│   ├── mission/          # Mission management
│   ├── application/      # Application management
│   └── ...               # Other modules
├── utils/                # Utility functions
│   ├── response.ts       # Response utilities
│   ├── logger.ts         # Logging utilities
│   └── AppError.ts       # Custom error classes
└── tests/                # Test files
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Zod schema validation
- **JWT Security**: Secure token handling
- **SQL Injection Protection**: Prisma ORM
- **XSS Protection**: Input sanitization

## 📊 Monitoring & Logging

- **Request Logging**: All requests are logged with timing
- **Error Logging**: Comprehensive error tracking
- **Security Logging**: Suspicious activity detection
- **File Logs**: Logs stored in `logs/` directory

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t pern-backend .

# Run container
docker run -p 5000:5000 pern-backend
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up database connection pooling
- Configure Redis for caching (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the test files for usage examples 