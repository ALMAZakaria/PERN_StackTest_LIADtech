"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("./application.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const applicationController = new application_controller_1.ApplicationController();
router.post('/', auth_middleware_1.authenticateToken, applicationController.createApplication);
router.get('/:id', applicationController.getApplication);
router.put('/:id', auth_middleware_1.authenticateToken, applicationController.updateApplication);
router.delete('/:id', auth_middleware_1.authenticateToken, applicationController.deleteApplication);
router.get('/user/my-applications', auth_middleware_1.authenticateToken, applicationController.getUserApplications);
router.get('/mission/:missionId', auth_middleware_1.authenticateToken, applicationController.getMissionApplications);
router.get('/search', applicationController.searchApplications);
exports.default = router;
//# sourceMappingURL=application.router.js.map