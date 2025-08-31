"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const AppError_1 = require("../../utils/AppError");
class NotificationService {
    constructor() {
        this.notifications = new Map();
    }
    generateId() {
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async createNotification(userId, type, title, message, data) {
        const notification = {
            id: this.generateId(),
            userId,
            type,
            title,
            message,
            isRead: false,
            createdAt: new Date(),
            data,
        };
        if (!this.notifications.has(userId)) {
            this.notifications.set(userId, []);
        }
        this.notifications.get(userId).push(notification);
        return notification;
    }
    async getUserNotifications(userId, limit = 50) {
        const userNotifications = this.notifications.get(userId) || [];
        return userNotifications
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit);
    }
    async getUnreadCount(userId) {
        const userNotifications = this.notifications.get(userId) || [];
        return userNotifications.filter(n => !n.isRead).length;
    }
    async markAsRead(userId, notificationId) {
        const userNotifications = this.notifications.get(userId);
        if (!userNotifications) {
            throw new AppError_1.AppError('No notifications found', 404);
        }
        const notification = userNotifications.find(n => n.id === notificationId);
        if (!notification) {
            throw new AppError_1.AppError('Notification not found', 404);
        }
        notification.isRead = true;
    }
    async markAllAsRead(userId) {
        const userNotifications = this.notifications.get(userId);
        if (!userNotifications) {
            return;
        }
        userNotifications.forEach(notification => {
            notification.isRead = true;
        });
    }
    async deleteNotification(userId, notificationId) {
        const userNotifications = this.notifications.get(userId);
        if (!userNotifications) {
            throw new AppError_1.AppError('No notifications found', 404);
        }
        const index = userNotifications.findIndex(n => n.id === notificationId);
        if (index === -1) {
            throw new AppError_1.AppError('Notification not found', 404);
        }
        userNotifications.splice(index, 1);
    }
    async clearOldNotifications(userId, daysOld = 30) {
        const userNotifications = this.notifications.get(userId);
        if (!userNotifications) {
            return;
        }
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const filteredNotifications = userNotifications.filter(notification => notification.createdAt > cutoffDate);
        this.notifications.set(userId, filteredNotifications);
    }
    async notifyApplicationReceived(companyUserId, freelancerName, missionTitle) {
        return this.createNotification(companyUserId, 'APPLICATION_RECEIVED', 'New Application Received', `${freelancerName} has applied to your mission: "${missionTitle}"`, { freelancerName, missionTitle });
    }
    async notifyApplicationAccepted(freelancerUserId, companyName, missionTitle) {
        return this.createNotification(freelancerUserId, 'APPLICATION_ACCEPTED', 'Application Accepted', `${companyName} has accepted your application for: "${missionTitle}"`, { companyName, missionTitle });
    }
    async notifyApplicationRejected(freelancerUserId, companyName, missionTitle) {
        return this.createNotification(freelancerUserId, 'APPLICATION_REJECTED', 'Application Update', `${companyName} has declined your application for: "${missionTitle}"`, { companyName, missionTitle });
    }
    async notifyMissionCompleted(freelancerUserId, companyName, missionTitle) {
        return this.createNotification(freelancerUserId, 'MISSION_COMPLETED', 'Mission Completed', `Congratulations! Your mission "${missionTitle}" for ${companyName} has been completed`, { companyName, missionTitle });
    }
    async notifyRatingReceived(userId, fromUserName, rating) {
        return this.createNotification(userId, 'RATING_RECEIVED', 'New Rating Received', `${fromUserName} has given you a ${rating}-star rating`, { fromUserName, rating });
    }
    async notifyMissionUpdated(userId, missionTitle, updateType) {
        return this.createNotification(userId, 'MISSION_UPDATED', 'Mission Updated', `Your mission "${missionTitle}" has been updated: ${updateType}`, { missionTitle, updateType });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map