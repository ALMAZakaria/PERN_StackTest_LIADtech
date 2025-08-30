"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mission_controller_1 = require("../controller/mission.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const missionController = new mission_controller_1.MissionController();
router.post('/', auth_middleware_1.authenticateToken, missionController.createMission);
router.get('/', missionController.searchMissions);
router.get('/:id', missionController.getMission);
router.put('/:id', auth_middleware_1.authenticateToken, missionController.updateMission);
router.delete('/:id', auth_middleware_1.authenticateToken, missionController.deleteMission);
router.get('/company/my-missions', auth_middleware_1.authenticateToken, missionController.getCompanyMissions);
router.get('/:missionId/recommended-freelancers', missionController.getRecommendedFreelancers);
exports.default = router;
//# sourceMappingURL=mission.router.js.map