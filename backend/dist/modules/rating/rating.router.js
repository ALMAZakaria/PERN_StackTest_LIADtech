"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rating_controller_1 = require("./rating.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const ratingController = new rating_controller_1.RatingController();
router.post('/', auth_middleware_1.authenticateToken, ratingController.createRating);
router.get('/:id', ratingController.getRating);
router.put('/:id', auth_middleware_1.authenticateToken, ratingController.updateRating);
router.delete('/:id', auth_middleware_1.authenticateToken, ratingController.deleteRating);
router.get('/user/my-ratings', auth_middleware_1.authenticateToken, ratingController.getUserRatings);
router.get('/user/average', auth_middleware_1.authenticateToken, ratingController.getUserAverageRating);
router.get('/search', ratingController.searchRatings);
exports.default = router;
//# sourceMappingURL=rating.router.js.map