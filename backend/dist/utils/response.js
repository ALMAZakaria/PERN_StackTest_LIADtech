"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, data, message = 'Success', statusCode = 200, meta) {
        const response = {
            success: true,
            message,
            data,
            meta
        };
        return res.status(statusCode).json(response);
    }
    static created(res, data, message = 'Created successfully') {
        return this.success(res, data, message, 201);
    }
    static badRequest(res, message = 'Bad request', errors) {
        const response = {
            success: false,
            message,
            errors
        };
        return res.status(400).json(response);
    }
    static unauthorized(res, message = 'Unauthorized') {
        const response = {
            success: false,
            message
        };
        return res.status(401).json(response);
    }
    static forbidden(res, message = 'Forbidden') {
        const response = {
            success: false,
            message
        };
        return res.status(403).json(response);
    }
    static notFound(res, message = 'Resource not found') {
        const response = {
            success: false,
            message
        };
        return res.status(404).json(response);
    }
    static conflict(res, message = 'Resource already exists') {
        const response = {
            success: false,
            message
        };
        return res.status(409).json(response);
    }
    static internalServerError(res, message = 'Internal server error') {
        const response = {
            success: false,
            message
        };
        return res.status(500).json(response);
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.js.map