"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const server_1 = require("../config/server");
const response_1 = require("../utils/response");
const error_handler_1 = require("../utils/error-handler");
const errorHandler = (error, req, res, next) => {
    logger_1.default.error('Error caught by error handler:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    if (error instanceof SyntaxError && 'body' in error) {
        res.status(400).json({ success: false, message: 'Invalid JSON format' });
        return;
    }
    if (error instanceof error_handler_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
        return;
    }
    if (error.name === 'PrismaClientKnownRequestError') {
        const prismaError = error;
        switch (prismaError.code) {
            case 'P2002':
                response_1.ResponseUtil.conflict(res, 'Resource already exists');
                return;
            case 'P2025':
                response_1.ResponseUtil.notFound(res, 'Resource not found');
                return;
            default:
                response_1.ResponseUtil.internalServerError(res, 'Database operation failed');
                return;
        }
    }
    if (error.name === 'ValidationError') {
        response_1.ResponseUtil.badRequest(res, 'Validation failed');
        return;
    }
    if (error.name === 'JsonWebTokenError') {
        response_1.ResponseUtil.unauthorized(res, 'Invalid token');
        return;
    }
    if (error.name === 'TokenExpiredError') {
        response_1.ResponseUtil.unauthorized(res, 'Token expired');
        return;
    }
    logger_1.default.error('Unhandled error:', error);
    const message = server_1.config.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message;
    response_1.ResponseUtil.internalServerError(res, message);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map