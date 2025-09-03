"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../controller/company.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const companyController = new company_controller_1.CompanyController();
router.post('/profile', auth_middleware_1.authenticateToken, companyController.createProfile);
router.get('/profile', auth_middleware_1.authenticateToken, companyController.getProfile);
router.put('/profile', auth_middleware_1.authenticateToken, companyController.updateProfile);
router.delete('/profile', auth_middleware_1.authenticateToken, companyController.deleteProfile);
router.get('/search', companyController.searchCompanies);
router.get('/stats', auth_middleware_1.authenticateToken, companyController.getCompanyStats);
exports.default = router;
//# sourceMappingURL=company.router.js.map