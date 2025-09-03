"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const notificationController = new notification_controller_1.NotificationController();
router.get('/', auth_middleware_1.authenticateToken, notificationController.getUserNotifications);
router.get('/unread-count', auth_middleware_1.authenticateToken, notificationController.getUnreadCount);
router.put('/:notificationId/mark-read', auth_middleware_1.authenticateToken, notificationController.markAsRead);
router.put('/mark-all-read', auth_middleware_1.authenticateToken, notificationController.markAllAsRead);
router.delete('/:notificationId', auth_middleware_1.authenticateToken, notificationController.deleteNotification);
router.delete('/clear-old', auth_middleware_1.authenticateToken, notificationController.clearOldNotifications);
exports.default = router;
//# sourceMappingURL=notification.router.js.map