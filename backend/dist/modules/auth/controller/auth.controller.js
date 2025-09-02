"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
const response_1 = require("../../../utils/response");
class AuthController {
    constructor() {
        this.simpleRegister = async (req, res, next) => {
            try {
                const userData = req.body;
                const result = await this.authService.simpleRegister(userData);
                response_1.ResponseUtil.created(res, result, 'User registered successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.register = async (req, res, next) => {
            try {
                const userData = req.body;
                const result = await this.authService.register(userData);
                response_1.ResponseUtil.created(res, result, 'User registered successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const credentials = req.body;
                const result = await this.authService.login(credentials);
                response_1.ResponseUtil.success(res, result, 'Login successful');
            }
            catch (error) {
                next(error);
            }
        };
        this.logout = async (req, res, next) => {
            try {
                const token = req.token;
                if (token) {
                    await this.authService.logout(token);
                }
                response_1.ResponseUtil.success(res, null, 'Logout successful');
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map