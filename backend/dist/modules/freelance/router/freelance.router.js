"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const freelance_controller_1 = require("../controller/freelance.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const freelanceController = new freelance_controller_1.FreelanceController();
router.post('/profile', auth_middleware_1.authenticateToken, freelanceController.createProfile);
router.get('/profile', auth_middleware_1.authenticateToken, freelanceController.getProfile);
router.put('/profile', auth_middleware_1.authenticateToken, freelanceController.updateProfile);
router.delete('/profile', auth_middleware_1.authenticateToken, freelanceController.deleteProfile);
router.get('/search', freelanceController.searchFreelancers);
router.get('/recommended-missions', auth_middleware_1.authenticateToken, freelanceController.getRecommendedMissions);
exports.default = router;
//# sourceMappingURL=freelance.router.js.map