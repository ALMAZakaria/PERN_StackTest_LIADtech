"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingController = void 0;
const rating_service_1 = require("./rating.service");
const response_1 = require("../../utils/response");
class RatingController {
    constructor() {
        this.createRating = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const rating = await this.ratingService.createRating(userId, req.body);
                response_1.ResponseUtil.created(res, rating, 'Rating submitted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getRating = async (req, res, next) => {
            try {
                const { id } = req.params;
                const rating = await this.ratingService.getRating(id);
                response_1.ResponseUtil.success(res, rating, 'Rating retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateRating = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const rating = await this.ratingService.updateRating(id, userId, req.body);
                response_1.ResponseUtil.success(res, rating, 'Rating updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteRating = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                await this.ratingService.deleteRating(id, userId);
                response_1.ResponseUtil.success(res, null, 'Rating deleted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserRatings = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const ratings = await this.ratingService.getUserRatings(userId);
                response_1.ResponseUtil.success(res, ratings, 'User ratings retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserAverageRating = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const averageRating = await this.ratingService.getUserAverageRating(userId);
                response_1.ResponseUtil.success(res, averageRating, 'User average rating retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.searchRatings = async (req, res, next) => {
            try {
                const filters = req.query;
                const ratings = await this.ratingService.searchRatings({
                    fromUserId: filters.fromUserId,
                    toUserId: filters.toUserId,
                    applicationId: filters.applicationId,
                });
                response_1.ResponseUtil.success(res, ratings, 'Ratings retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.ratingService = new rating_service_1.RatingService();
    }
}
exports.RatingController = RatingController;
//# sourceMappingURL=rating.controller.js.map