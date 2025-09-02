"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityLogger = exports.requestLogger = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const requestLogger = (req, res, next) => {
    const start = Date.now();
    logger_1.default.info('Incoming request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
    });
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';
        logger_1.default[logLevel]('Request completed', {
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
exports.requestLogger = requestLogger;
const securityLogger = (req, res, next) => {
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
        logger_1.default.warn('Potential security threat detected', {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            suspiciousContent: userInput.substring(0, 500),
            timestamp: new Date().toISOString(),
        });
    }
    next();
};
exports.securityLogger = securityLogger;
//# sourceMappingURL=logger.middleware.js.map