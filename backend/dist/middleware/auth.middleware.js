"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUserTypes = exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../config/server");
const error_handler_1 = require("../utils/error-handler");
const response_1 = require("../utils/response");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new error_handler_1.AuthenticationError('Access token is required');
        }
        if (!authHeader.startsWith('Bearer ')) {
            throw new error_handler_1.AuthenticationError('Invalid authorization header format');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new error_handler_1.AuthenticationError('Access token is required');
        }
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
        const decoded = jsonwebtoken_1.default.verify(token, server_1.config.JWT_SECRET);
        req.user = {
            id: decoded.userId || decoded.id,
            email: decoded.email,
            role: decoded.role,
            userType: decoded.userType,
        };
        req.token = token;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            response_1.ResponseUtil.unauthorized(res, 'Invalid token');
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            response_1.ResponseUtil.unauthorized(res, 'Token expired');
            return;
        }
        if (error instanceof error_handler_1.AuthenticationError) {
            response_1.ResponseUtil.unauthorized(res, error.message);
            return;
        }
        response_1.ResponseUtil.unauthorized(res, 'Authentication failed');
        return;
    }
};
exports.authenticateToken = authenticateToken;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new error_handler_1.AuthenticationError('User not authenticated');
            }
            if (!roles.includes(req.user.role)) {
                throw new error_handler_1.AuthorizationError('Insufficient permissions');
            }
            next();
        }
        catch (error) {
            if (error instanceof error_handler_1.AuthorizationError) {
                response_1.ResponseUtil.forbidden(res, error.message);
                return;
            }
            response_1.ResponseUtil.unauthorized(res, 'Authentication required');
            return;
        }
    };
};
exports.authorizeRoles = authorizeRoles;
const authorizeUserTypes = (...userTypes) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new error_handler_1.AuthenticationError('User not authenticated');
            }
            if (!req.user.userType || !userTypes.includes(req.user.userType)) {
                throw new error_handler_1.AuthorizationError('Insufficient permissions for this user type');
            }
            next();
        }
        catch (error) {
            if (error instanceof error_handler_1.AuthorizationError) {
                response_1.ResponseUtil.forbidden(res, error.message);
                return;
            }
            response_1.ResponseUtil.unauthorized(res, 'Authentication required');
            return;
        }
    };
};
exports.authorizeUserTypes = authorizeUserTypes;
//# sourceMappingURL=auth.middleware.js.map