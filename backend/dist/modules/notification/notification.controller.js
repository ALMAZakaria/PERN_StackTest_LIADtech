"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
const response_1 = require("../../utils/response");
class NotificationController {
    constructor() {
        this.getUserNotifications = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const limit = req.query.limit ? parseInt(req.query.limit) : 50;
                const notifications = await this.notificationService.getUserNotifications(userId, limit);
                response_1.ResponseUtil.success(res, notifications, 'Notifications retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getUnreadCount = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const count = await this.notificationService.getUnreadCount(userId);
                response_1.ResponseUtil.success(res, { count }, 'Unread count retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.markAsRead = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { notificationId } = req.params;
                await this.notificationService.markAsRead(userId, notificationId);
                response_1.ResponseUtil.success(res, null, 'Notification marked as read');
            }
            catch (error) {
                next(error);
            }
        };
        this.markAllAsRead = async (req, res, next) => {
            try {
                const userId = req.user.id;
                await this.notificationService.markAllAsRead(userId);
                response_1.ResponseUtil.success(res, null, 'All notifications marked as read');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteNotification = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { notificationId } = req.params;
                await this.notificationService.deleteNotification(userId, notificationId);
                response_1.ResponseUtil.success(res, null, 'Notification deleted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.clearOldNotifications = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const daysOld = req.query.daysOld ? parseInt(req.query.daysOld) : 30;
                await this.notificationService.clearOldNotifications(userId, daysOld);
                response_1.ResponseUtil.success(res, null, 'Old notifications cleared successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.notificationService = new notification_service_1.NotificationService();
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map