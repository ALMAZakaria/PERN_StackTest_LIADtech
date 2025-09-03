import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { config } from '../config/server';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log request details
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Log response details
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    
    logger[logLevel]('Request completed', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

// Security logging middleware
export const securityLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Log potential security issues
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
  ];

  const userInput = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(userInput));

  if (hasSuspiciousContent) {
    logger.warn('Potential security threat detected', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      suspiciousContent: userInput.substring(0, 500), // Limit log size
      timestamp: new Date().toISOString(),
    });
  }

  next();
}; 