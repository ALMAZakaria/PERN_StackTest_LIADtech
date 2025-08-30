import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';
import { RegisterDto, LoginDto, AuthResponse } from '../dto/auth.dto';
import { AppError } from '../../../utils/AppError';
import { config } from '../../../config/server';

const prisma = new PrismaClient();

export class AuthService {
  private generateTokens(userId: string, role: Role) {
    const payload = { userId, role: role.toString() };
    
    const accessToken = jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      payload,
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      userType,
      companyName,
      industry,
      companySize,
      skills,
      dailyRate,
      availability,
      experience
    } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with transaction to handle profile creation
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: Role.USER,
          userType: userType as any,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          userType: true,
          isActive: true,
          createdAt: true,
        }
      });

      // Create profile based on user type
      if (userType === 'COMPANY' && companyName && industry && companySize) {
        await tx.companyProfile.create({
          data: {
            userId: user.id,
            companyName,
            industry,
            size: companySize as any,
          }
        });
      } else if (userType === 'FREELANCER' && skills && dailyRate && availability && experience !== undefined) {
        await tx.freelanceProfile.create({
          data: {
            userId: user.id,
            skills,
            dailyRate: new (tx as any).Prisma.Decimal(dailyRate),
            availability,
            experience,
          }
        });
      }

      return user;
    });

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(result.id, result.role);

    return {
      user: {
        id: result.id,
        name: `${result.firstName} ${result.lastName}`.trim(),
        email: result.email,
        role: result.role,
        userType: result.userType,
        isActive: result.isActive,
        createdAt: result.createdAt,
      },
      token: accessToken,
      refreshToken,
    };
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        userType: true,
        isActive: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new AppError('Invalid email or password', 400);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 400);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 400);
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        userType: user.userType,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token: accessToken,
      refreshToken,
    };
  }

  async logout(token: string): Promise<void> {
    // In a production app, you might want to blacklist the token
    // For now, we'll just acknowledge the logout
    // You could store blacklisted tokens in Redis or database
    console.log(`User logged out with token: ${token.substring(0, 20)}...`);
  }

  async verifyToken(token: string): Promise<{ userId: string; role: Role }> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string; role: Role };
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }
} 