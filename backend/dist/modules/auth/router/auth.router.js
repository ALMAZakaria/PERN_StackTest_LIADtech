"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const validation_middleware_1 = require("../../../middleware/validation.middleware");
const auth_dto_1 = require("../dto/auth.dto");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/register', (0, validation_middleware_1.validateRequest)(auth_dto_1.simpleRegisterSchema), authController.simpleRegister);
router.post('/register-full', (0, validation_middleware_1.validateRequest)(auth_dto_1.registerSchema), authController.register);
router.post('/login', (0, validation_middleware_1.validateRequest)(auth_dto_1.loginSchema), authController.login);
router.post('/logout', authController.logout);
exports.default = router;
//# sourceMappingURL=auth.router.js.map