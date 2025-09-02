# SkillBridge - Freelance Platform Documentation

## 📋 Project Overview

**SkillBridge** is a comprehensive freelance platform built with the PERN stack (PostgreSQL, Express.js, React, Node.js) that connects freelancers with companies seeking specialized talent. The platform facilitates mission posting, application management, and project collaboration between freelancers and companies.

### 🎯 Purpose
SkillBridge serves as a bridge between skilled freelancers and companies looking for project-based work. It provides a complete ecosystem for:
- **Companies**: Post missions, review applications, manage projects, and rate freelancers
- **Freelancers**: Browse missions, submit applications, showcase portfolios, and build reputation
- **Administrators**: Manage users, moderate content, and oversee platform operations

### ✨ Key Features

#### For Freelancers
- **Profile Management**: Create detailed freelance profiles with skills, rates, and experience
- **Portfolio Showcase**: Display projects with technologies, links, and descriptions
- **Mission Discovery**: Browse and filter available missions by skills, budget, and location
- **Application System**: Submit proposals with rates and estimated duration
- **Rating System**: Build reputation through client feedback
- **Application Tracking**: Monitor application status and manage submissions

#### For Companies
- **Company Profiles**: Create company profiles with industry, size, and description
- **Mission Creation**: Post detailed missions with requirements, budget, and timeline
- **Application Management**: Review, accept, or reject freelancer applications
- **Project Management**: Track mission progress and completion
- **Freelancer Rating**: Rate freelancers based on project performance

#### Platform Features
- **Role-Based Access Control**: User, Company, Freelancer, Admin, and Moderator roles
- **Real-time Notifications**: Application updates and status changes
- **Advanced Search & Filtering**: Find missions and freelancers efficiently
- **Responsive Design**: Mobile-first approach for all devices
- **Security**: JWT authentication, rate limiting, and input validation

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session management and caching
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schema validation
- **Testing**: Jest with Supertest
- **Documentation**: Swagger/OpenAPI 3.0

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI
- **Animations**: Framer Motion
- **Testing**: Vitest with React Testing Library

#### Infrastructure
- **Containerization**: Docker with Docker Compose
- **Database Management**: pgAdmin
- **Cache Management**: Redis Commander
- **Development**: Hot reload with ts-node-dev

## 📁 Project Structure

```
skillbridge/
├── backend/                          # Express.js backend
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   ├── prisma.ts            # Database configuration
│   │   │   ├── redis.ts             # Redis configuration
│   │   │   └── server.ts            # Server configuration
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── auth.middleware.ts   # JWT authentication
│   │   │   ├── error.middleware.ts  # Error handling
│   │   │   ├── logger.middleware.ts # Request logging
│   │   │   └── validation.middleware.ts # Input validation
│   │   ├── modules/                  # Feature modules
│   │   │   ├── auth/                # Authentication module
│   │   │   ├── user/                # User management
│   │   │   ├── freelance/           # Freelancer profiles
│   │   │   ├── company/             # Company profiles
│   │   │   ├── mission/             # Mission management
│   │   │   ├── application/         # Application system
│   │   │   ├── portfolio/           # Portfolio management
│   │   │   ├── rating/              # Rating system
│   │   │   ├── skills/              # Skills management
│   │   │   ├── notification/        # Notification system
│   │   │   └── dashboard/           # Dashboard analytics
│   │   ├── utils/                   # Utility functions
│   │   │   ├── AppError.ts          # Custom error class
│   │   │   ├── response.ts          # Response utilities
│   │   │   ├── logger.ts            # Logging utilities
│   │   │   └── error-handler.ts     # Error handling utilities
│   │   ├── app.ts                   # Express app configuration
│   │   └── server.ts                # Server entry point
│   ├── prisma/                      # Database schema and migrations
│   │   ├── schema.prisma           # Database schema
│   │   ├── migrations/             # Database migrations
│   │   ├── seed.ts                 # Database seeding
│   │   └── skillbridge.db          # SQLite database (development)
│   ├── tests/                      # Test files
│   ├── logs/                       # Application logs
│   └── scripts/                    # Database setup scripts
├── frontend/                        # React frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── ui/                 # Generic UI components
│   │   │   └── dashboard/          # Dashboard components
│   │   ├── pages/                  # Route-level pages
│   │   │   ├── auth/               # Authentication pages
│   │   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── missions/           # Mission-related pages
│   │   │   └── applications/       # Application pages
│   │   ├── services/               # API service layer
│   │   ├── state/                  # Redux store and slices
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Utility functions
│   │   ├── router/                 # React Router configuration
│   │   ├── styles/                 # Global styles
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   ├── public/                     # Static assets
│   └── dist/                       # Build output
├── docker-compose.yml              # Docker services configuration
└── README.md                       # Project overview
```

## 🚀 Installation and Setup

### Prerequisites

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 14 or higher
- **Redis**: Version 6 or higher
- **Git**: For version control
- **Docker & Docker Compose**: For containerized development (optional)

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillbridge
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs
   - Database Management: http://localhost:8080 (pgAdmin)
   - Redis Management: http://localhost:8081 (Redis Commander)

### Manual Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env file with your database credentials:
DATABASE_URL="postgresql://username:password@localhost:5432/skillbridge_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/skillbridge_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# API Documentation
SWAGGER_ENABLED=true
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 📚 How to Use the Project

### Getting Started

1. **Register an Account**
   - Visit http://localhost:3000/register
   - Choose your user type (Freelancer or Company)
   - Fill in your details and create an account

2. **Complete Your Profile**
   - **Freelancers**: Add skills, set daily rate, upload portfolio projects
   - **Companies**: Add company information, industry, and description

3. **Start Using the Platform**
   - **Freelancers**: Browse missions, submit applications
   - **Companies**: Post missions, review applications

### User Workflows

#### For Freelancers

1. **Profile Setup**
   ```typescript
   // Example: Creating a freelance profile
   const profile = {
     skills: ['React', 'TypeScript', 'Node.js'],
     dailyRate: 500,
     availability: 40,
     bio: 'Senior React Developer with 5+ years experience',
     location: 'San Francisco, CA',
     experience: 5
   }
   ```

2. **Browse Missions**
   - Use filters to find relevant missions
   - Search by skills, budget range, location
   - View mission details and company information

3. **Submit Applications**
   ```typescript
   // Example: Submitting an application
   const application = {
     missionId: 'mission_id',
     proposal: 'Detailed proposal explaining approach...',
     proposedRate: 450,
     estimatedDuration: 4
   }
   ```

4. **Manage Applications**
   - Track application status
   - Withdraw applications if needed
   - Receive notifications for updates

#### For Companies

1. **Company Profile Setup**
   ```typescript
   // Example: Creating a company profile
   const companyProfile = {
     companyName: 'TechStartup Inc',
     industry: 'Technology',
     size: 'STARTUP',
     description: 'Innovative startup building the next big thing',
     website: 'https://techstartup.com',
     location: 'San Francisco, CA'
   }
   ```

2. **Post Missions**
   ```typescript
   // Example: Creating a mission
   const mission = {
     title: 'React Developer Needed for E-commerce Platform',
     description: 'Looking for a senior React developer...',
     requiredSkills: ['React', 'TypeScript', 'Next.js'],
     budget: 8000,
     duration: 6,
     location: 'Remote',
     isRemote: true,
     urgency: 'NORMAL'
   }
   ```

3. **Review Applications**
   - View all applications for your missions
   - Accept or reject applications
   - Communicate with freelancers

### API Usage Examples

#### Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use the returned JWT token for authenticated requests
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Missions
```bash
# Get all missions
curl -X GET http://localhost:5000/api/v1/missions

# Create a mission
curl -X POST http://localhost:5000/api/v1/missions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Developer Needed",
    "description": "Looking for a React developer...",
    "requiredSkills": ["React", "TypeScript"],
    "budget": 5000,
    "duration": 4,
    "isRemote": true
  }'
```

#### Applications
```bash
# Submit an application
curl -X POST http://localhost:5000/api/v1/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "missionId": "mission_id",
    "proposal": "I can help with this project...",
    "proposedRate": 400,
    "estimatedDuration": 3
  }'
```

## 🔧 Dependencies and Requirements

### Backend Dependencies

#### Core Dependencies
- **express**: Web framework
- **@prisma/client**: Database ORM
- **redis**: Caching and session storage
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **zod**: Schema validation
- **winston**: Logging
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **compression**: Response compression
- **morgan**: HTTP request logging

#### Development Dependencies
- **typescript**: TypeScript compiler
- **ts-node-dev**: Development server with hot reload
- **jest**: Testing framework
- **supertest**: HTTP testing
- **eslint**: Code linting
- **prettier**: Code formatting
- **@types/***: TypeScript type definitions

### Frontend Dependencies

#### Core Dependencies
- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **@reduxjs/toolkit**: State management
- **react-redux**: React Redux bindings
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling
- **@hookform/resolvers**: Form validation
- **zod**: Schema validation
- **axios**: HTTP client
- **tailwindcss**: Utility-first CSS framework
- **@headlessui/react**: Accessible UI components
- **framer-motion**: Animation library
- **react-hot-toast**: Toast notifications

#### Development Dependencies
- **vite**: Build tool and dev server
- **@vitejs/plugin-react**: Vite React plugin
- **typescript**: TypeScript compiler
- **vitest**: Testing framework
- **@testing-library/react**: React testing utilities
- **eslint**: Code linting
- **prettier**: Code formatting
- **autoprefixer**: CSS vendor prefixing
- **postcss**: CSS processing

### Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and basic user information
- **FreelanceProfiles**: Freelancer-specific information
- **CompanyProfiles**: Company-specific information
- **Missions**: Job postings by companies
- **Applications**: Freelancer applications to missions
- **PortfolioProjects**: Freelancer portfolio items
- **Ratings**: User ratings and reviews

### System Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB free space
- **Network**: Internet connection for package installation

#### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 20GB+ free space
- **Network**: Stable internet connection

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test suites
npm run test:auth
npm run test:api
```

### Frontend Testing
```bash
cd frontend

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Build

#### Backend
```bash
cd backend

# Build TypeScript
npm run build

# Start production server
npm start
```

#### Frontend
```bash
cd frontend

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment
```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-Specific Configurations

#### Development
- Hot reload enabled
- Detailed error messages
- Swagger documentation enabled
- SQLite database for simplicity

#### Production
- Optimized builds
- Error message sanitization
- Rate limiting enabled
- PostgreSQL database
- Redis for caching

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin policies
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **Security Headers**: Helmet.js implementation
- **Error Sanitization**: Prevents information leakage

## 📊 Monitoring and Logging

- **Winston Logging**: Structured logging with multiple levels
- **Request Logging**: HTTP request/response logging
- **Error Tracking**: Comprehensive error handling
- **Health Checks**: Application health monitoring
- **Performance Monitoring**: Response time tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use ESLint and Prettier for code formatting
- Follow the existing code structure and patterns
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and API documentation
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact the development team for urgent issues

---

**Happy Coding with LIADTech ! 🎉**
