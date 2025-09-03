# Auth Routes Tests

This directory contains comprehensive Jest + Supertest tests for the authentication routes in your PERN stack application.

## Test Files

### `auth-routes-simple.test.ts`
Comprehensive tests for authentication routes using the simple-api (no database required).

### `auth-routes.test.ts`
Tests for authentication routes using the full app with Prisma database (requires database setup).

### `auth-routes.setup.ts`
Test utilities and setup functions for database-based tests.

## Test Coverage

The auth routes tests cover the following areas:

### 🔐 Authentication Endpoints
- **POST /api/v1/auth/register**
  - User registration with validation
  - Freelancer and company registration
  - Duplicate email handling
  - Input validation (email, password, name)

- **POST /api/v1/auth/login**
  - Successful login with valid credentials
  - Invalid credentials handling
  - Missing fields validation
  - Email format validation

- **POST /api/v1/auth/logout**
  - Successful logout with valid token
  - Invalid token handling
  - Missing authorization header

### 🛡️ Security Tests
- Password hashing verification
- Token format validation
- Password exposure prevention
- JWT token structure validation

### 🔒 Authorization & Access Control
- Protected route access with valid tokens
- Admin-only functionality
- Role-based access control
- Token validation middleware

### ⚠️ Error Handling
- Malformed JSON handling
- Missing request body
- Large request body handling
- Validation error responses

### 📊 API Response Structure
- Consistent success response format
- Consistent error response format
- Data structure validation

## Running Tests

### Simple API Tests (No Database Required)
```bash
npm test src/tests/auth-routes-simple.test.ts
```

### Full API Tests (Requires Database)
```bash
# First, ensure database is set up
npm run db:seed

# Then run the tests
npm test src/tests/auth-routes.test.ts
```

### All Tests
```bash
npm test
```

## Test Structure

### Test Organization
Tests are organized into logical groups:
- **User Registration**: Tests for user signup functionality
- **User Login**: Tests for authentication
- **Protected Routes**: Tests for authenticated endpoints
- **User Management**: Tests for admin-only operations
- **Token Validation**: Tests for JWT token handling
- **Error Handling**: Tests for edge cases and error scenarios
- **Security Tests**: Tests for security best practices
- **API Response Structure**: Tests for consistent API responses

### Test Utilities
The `auth-routes.setup.ts` file provides:
- Database cleanup functions
- Test user creation utilities
- Token validation helpers
- Test data generators
- Constants for expected messages

## Test Data

### Simple API Tests
- Uses in-memory data store
- Pre-seeded users: `admin@demo.com`, `john@example.com`
- Password: `demo123` for all seeded users

### Database Tests
- Requires PostgreSQL database
- Uses Prisma for database operations
- Includes cleanup between tests
- Creates temporary test users

## Expected Test Results

### Simple API Tests
```
Test Suites: 1 passed, 1 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        16.893 s
```

### Test Categories
- **User Registration**: 6 tests
- **User Login**: 7 tests
- **Protected Routes**: 5 tests
- **User Management**: 3 tests
- **Token Validation**: 3 tests
- **Error Handling**: 3 tests
- **Security Tests**: 3 tests
- **API Response Structure**: 2 tests
- **Health Check**: 1 test

## Best Practices

### Test Isolation
- Each test is independent
- Database cleanup between tests
- No shared state between test suites

### Error Testing
- Tests both success and failure scenarios
- Validates error messages and status codes
- Tests edge cases and invalid inputs

### Security Testing
- Verifies password hashing
- Tests token validation
- Ensures sensitive data is not exposed

### API Consistency
- Validates response structure
- Tests consistent error handling
- Ensures proper HTTP status codes

## Troubleshooting

### Database Connection Issues
If database tests fail:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env file
3. Run `npm run prisma:migrate` to set up database
4. Run `npm run db:seed` to populate test data

### Simple API Test Issues
If simple API tests fail:
1. Check that simple-api.ts exports correctly
2. Verify JWT secret is set
3. Ensure all required dependencies are installed

### Test Environment
- Tests run in Node.js environment
- Uses Jest as test runner
- Supertest for HTTP assertions
- TypeScript support enabled
