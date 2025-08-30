"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
function validateRequest(schema) {
    return (req, res, next) => {
        try {
            if (schema.body || schema.params || schema.query) {
                if (schema.body) {
                    req.body = schema.body.parse(req.body);
                }
                if (schema.params) {
                    req.params = schema.params.parse(req.params);
                }
                if (schema.query) {
                    req.query = schema.query.parse(req.query);
                }
            }
            else {
                const validatedData = schema.parse({
                    body: req.body,
                    params: req.params,
                    query: req.query,
                });
                if (validatedData.body) {
                    req.body = validatedData.body;
                }
                if (validatedData.params) {
                    req.params = validatedData.params;
                }
                if (validatedData.query) {
                    req.query = validatedData.query;
                }
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                response_1.ResponseUtil.badRequest(res, 'Validation failed', errorMessages);
                return;
            }
            response_1.ResponseUtil.badRequest(res, 'Invalid request data');
            return;
        }
    };
}
;
//# sourceMappingURL=validation.middleware.js.map