"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controller/dashboard.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
router.get('/statistics', auth_middleware_1.authenticateToken, dashboardController.getStatistics);
router.get('/activity', auth_middleware_1.authenticateToken, dashboardController.getRecentActivity);
exports.default = router;
//# sourceMappingURL=dashboard.router.js.map