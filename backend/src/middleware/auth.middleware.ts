import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/server';
import { AuthenticationError, AuthorizationError } from '../utils/error-handler';
import { ResponseUtil } from '../utils/response';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    userType?: string;
  };
  token?: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AuthenticationError('Access token is required');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Invalid authorization header format');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Access token is required');
    }

    // Handle demo token for testing
    if (token === 'demo-token') {
      req.user = {
        id: '1',
        email: 'admin@demo.com',
        role: 'admin',
        userType: 'ADMIN',
      };
      req.token = token;
      next();
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    
    // Handle both old and new JWT payload structures
    req.user = {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role,
      userType: decoded.userType,
    };
    req.token = token;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      ResponseUtil.unauthorized(res, 'Invalid token');
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      ResponseUtil.unauthorized(res, 'Token expired');
      return;
    }
    if (error instanceof AuthenticationError) {
      ResponseUtil.unauthorized(res, error.message);
      return;
    }
    ResponseUtil.unauthorized(res, 'Authentication failed');
    return;
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      if (!roles.includes(req.user.role)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      if (error instanceof AuthorizationError) {
        ResponseUtil.forbidden(res, error.message);
        return;
      }
      ResponseUtil.unauthorized(res, 'Authentication required');
      return;
    }
  };
};

// Additional middleware for user type authorization
export const authorizeUserTypes = (...userTypes: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      if (!req.user.userType || !userTypes.includes(req.user.userType)) {
        throw new AuthorizationError('Insufficient permissions for this user type');
      }

      next();
    } catch (error) {
      if (error instanceof AuthorizationError) {
        ResponseUtil.forbidden(res, error.message);
        return;
      }
      ResponseUtil.unauthorized(res, 'Authentication required');
      return;
    }
  };
}; 