"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusSchema = exports.updateApplicationSchema = exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    missionId: zod_1.z.string().min(1, 'Mission ID is required'),
    proposal: zod_1.z.string().min(10, 'Proposal must be at least 10 characters'),
    proposedRate: zod_1.z.number().positive('Proposed rate must be positive'),
    estimatedDuration: zod_1.z.number().min(1, 'Estimated duration must be at least 1 week'),
});
exports.updateApplicationSchema = zod_1.z.object({
    proposal: zod_1.z.string().min(10, 'Proposal must be at least 10 characters').optional(),
    proposedRate: zod_1.z.number().positive('Proposed rate must be positive').optional(),
    estimatedDuration: zod_1.z.number().min(1, 'Estimated duration must be at least 1 week').optional(),
});
exports.updateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']),
});
//# sourceMappingURL=application.dto.js.map