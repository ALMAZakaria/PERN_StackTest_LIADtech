"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const rating_repository_1 = require("./rating.repository");
const AppError_1 = require("../../utils/AppError");
class RatingService {
    constructor() {
        this.ratingRepository = new rating_repository_1.RatingRepository();
    }
    async createRating(userId, data) {
        if (data.rating < 1 || data.rating > 5) {
            throw new AppError_1.AppError('Rating must be between 1 and 5', 400);
        }
        if (data.fromUserId !== userId) {
            throw new AppError_1.AppError('You can only create ratings from your own account', 403);
        }
        const existingRating = await this.ratingRepository.findByApplicationId(data.applicationId);
        if (existingRating) {
            throw new AppError_1.AppError('Rating already exists for this application', 400);
        }
        const { ApplicationRepository } = await Promise.resolve().then(() => __importStar(require('../application/application.repository')));
        const applicationRepository = new ApplicationRepository();
        const application = await applicationRepository.findById(data.applicationId);
        if (!application) {
            throw new AppError_1.AppError('Application not found', 404);
        }
        if (application.status !== 'ACCEPTED') {
            throw new AppError_1.AppError('Can only rate completed applications', 400);
        }
        if (application.freelancerId !== userId && application.companyId !== userId) {
            throw new AppError_1.AppError('You can only rate applications you are involved in', 403);
        }
        if (application.freelancerId !== data.toUserId && application.companyId !== data.toUserId) {
            throw new AppError_1.AppError('Invalid target user for rating', 400);
        }
        return this.ratingRepository.create(data);
    }
    async getRating(id) {
        const rating = await this.ratingRepository.findById(id);
        if (!rating) {
            throw new AppError_1.AppError('Rating not found', 404);
        }
        return rating;
    }
    async updateRating(id, userId, data) {
        const rating = await this.ratingRepository.findById(id);
        if (!rating) {
            throw new AppError_1.AppError('Rating not found', 404);
        }
        if (rating.fromUserId !== userId) {
            throw new AppError_1.AppError('Not authorized to update this rating', 403);
        }
        if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
            throw new AppError_1.AppError('Rating must be between 1 and 5', 400);
        }
        return this.ratingRepository.update(id, data);
    }
    async deleteRating(id, userId) {
        const rating = await this.ratingRepository.findById(id);
        if (!rating) {
            throw new AppError_1.AppError('Rating not found', 404);
        }
        if (rating.fromUserId !== userId) {
            throw new AppError_1.AppError('Not authorized to delete this rating', 403);
        }
        await this.ratingRepository.delete(id);
    }
    async getUserRatings(userId) {
        return this.ratingRepository.findByUserId(userId);
    }
    async getUserAverageRating(userId) {
        return this.ratingRepository.getUserAverageRating(userId);
    }
    async searchRatings(filters) {
        return this.ratingRepository.findMany(filters);
    }
}
exports.RatingService = RatingService;
//# sourceMappingURL=rating.service.js.map