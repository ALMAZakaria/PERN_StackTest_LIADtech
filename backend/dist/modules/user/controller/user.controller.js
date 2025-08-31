"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const user_cache_1 = require("../cache/user.cache");
const response_1 = require("../../../utils/response");
class UserController {
    constructor() {
        this.simpleCreateUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const newUser = await this.userService.simpleCreateUser(userData);
                response_1.ResponseUtil.created(res, newUser, 'User created successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.register = async (req, res, next) => {
            try {
                const userData = req.body;
                const result = await this.userService.register(userData);
                response_1.ResponseUtil.created(res, result, 'User registered successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const credentials = req.body;
                const result = await this.userService.login(credentials);
                response_1.ResponseUtil.success(res, result, 'Login successful');
            }
            catch (error) {
                next(error);
            }
        };
        this.refreshToken = async (req, res, next) => {
            try {
                const { refreshToken } = req.body;
                const result = await this.userService.refreshToken(refreshToken);
                response_1.ResponseUtil.success(res, result, 'Token refreshed successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                let user = await this.userCache.getUser(userId);
                if (!user) {
                    user = await this.userService.getProfile(userId);
                    await this.userCache.setUser(userId, user);
                }
                response_1.ResponseUtil.success(res, user, 'Profile retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const updateData = req.body;
                const updatedUser = await this.userService.updateProfile(userId, updateData);
                await this.userCache.setUser(userId, updatedUser);
                response_1.ResponseUtil.success(res, updatedUser, 'Profile updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.changePassword = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const passwordData = req.body;
                await this.userService.changePassword(userId, passwordData);
                response_1.ResponseUtil.success(res, undefined, 'Password changed successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.createUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const newUser = await this.userService.createUser(userData);
                response_1.ResponseUtil.created(res, newUser, 'User created successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getUsers = async (req, res, next) => {
            try {
                const query = req.query;
                const cacheKey = JSON.stringify(query);
                let result = await this.userCache.getUserList(cacheKey);
                if (!result) {
                    result = await this.userService.getUsers(query);
                    await this.userCache.setUserList(cacheKey, result);
                }
                response_1.ResponseUtil.success(res, result.users, 'Users retrieved successfully', 200, result.meta);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserById = async (req, res, next) => {
            try {
                const { id } = req.params;
                let user = await this.userCache.getUser(id);
                if (!user) {
                    user = await this.userService.getUserById(id);
                    await this.userCache.setUser(id, user);
                }
                response_1.ResponseUtil.success(res, user, 'User retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.userService.deleteUser(id);
                await this.userCache.clearUserCaches(id);
                response_1.ResponseUtil.success(res, undefined, 'User deleted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.checkEmailAvailability = async (req, res, next) => {
            try {
                const { email } = req.query;
                if (!email || typeof email !== 'string') {
                    response_1.ResponseUtil.badRequest(res, 'Email parameter is required');
                    return;
                }
                const isAvailable = !(await this.userService['userRepository'].existsByEmail(email));
                response_1.ResponseUtil.success(res, { available: isAvailable }, 'Email availability checked');
            }
            catch (error) {
                next(error);
            }
        };
        this.userService = new user_service_1.UserService();
        this.userCache = new user_cache_1.UserCache();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map