"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMissionsSchema = exports.updateMissionSchema = exports.createMissionSchema = void 0;
const zod_1 = require("zod");
exports.createMissionSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    requiredSkills: zod_1.z.array(zod_1.z.string()).min(1, 'At least one skill is required'),
    budget: zod_1.z.number().positive('Budget must be positive'),
    duration: zod_1.z.number().min(1, 'Duration must be at least 1 week'),
    location: zod_1.z.string().optional(),
    isRemote: zod_1.z.boolean().default(true),
    urgency: zod_1.z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
});
exports.updateMissionSchema = exports.createMissionSchema.partial();
exports.searchMissionsSchema = zod_1.z.object({
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    minBudget: zod_1.z.number().positive().optional(),
    maxBudget: zod_1.z.number().positive().optional(),
    location: zod_1.z.string().optional(),
    isRemote: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'EXPIRED']).optional(),
    urgency: zod_1.z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(20),
});
//# sourceMappingURL=mission.dto.js.map