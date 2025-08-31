import { AppError } from '../../utils/AppError';

export interface Notification {
  id: string;
  userId: string;
  type: 'APPLICATION_RECEIVED' | 'APPLICATION_ACCEPTED' | 'APPLICATION_REJECTED' | 'MISSION_COMPLETED' | 'RATING_RECEIVED' | 'MISSION_UPDATED';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

export class NotificationService {
  private notifications: Map<string, Notification[]> = new Map();

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async createNotification(userId: string, type: Notification['type'], title: string, message: string, data?: any): Promise<Notification> {
    const notification: Notification = {
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

    this.notifications.get(userId)!.push(notification);

    return notification;
  }

  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter(n => !n.isRead).length;
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) {
      throw new AppError('No notifications found', 404);
    }

    const notification = userNotifications.find(n => n.id === notificationId);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    notification.isRead = true;
  }

  async markAllAsRead(userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) {
      return;
    }

    userNotifications.forEach(notification => {
      notification.isRead = true;
    });
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) {
      throw new AppError('No notifications found', 404);
    }

    const index = userNotifications.findIndex(n => n.id === notificationId);
    if (index === -1) {
      throw new AppError('Notification not found', 404);
    }

    userNotifications.splice(index, 1);
  }

  async clearOldNotifications(userId: string, daysOld: number = 30): Promise<void> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) {
      return;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const filteredNotifications = userNotifications.filter(
      notification => notification.createdAt > cutoffDate
    );

    this.notifications.set(userId, filteredNotifications);
  }

  // Helper methods for common notification types
  async notifyApplicationReceived(companyUserId: string, freelancerName: string, missionTitle: string): Promise<Notification> {
    return this.createNotification(
      companyUserId,
      'APPLICATION_RECEIVED',
      'New Application Received',
      `${freelancerName} has applied to your mission: "${missionTitle}"`,
      { freelancerName, missionTitle }
    );
  }

  async notifyApplicationAccepted(freelancerUserId: string, companyName: string, missionTitle: string): Promise<Notification> {
    return this.createNotification(
      freelancerUserId,
      'APPLICATION_ACCEPTED',
      'Application Accepted',
      `${companyName} has accepted your application for: "${missionTitle}"`,
      { companyName, missionTitle }
    );
  }

  async notifyApplicationRejected(freelancerUserId: string, companyName: string, missionTitle: string): Promise<Notification> {
    return this.createNotification(
      freelancerUserId,
      'APPLICATION_REJECTED',
      'Application Update',
      `${companyName} has declined your application for: "${missionTitle}"`,
      { companyName, missionTitle }
    );
  }

  async notifyMissionCompleted(freelancerUserId: string, companyName: string, missionTitle: string): Promise<Notification> {
    return this.createNotification(
      freelancerUserId,
      'MISSION_COMPLETED',
      'Mission Completed',
      `Congratulations! Your mission "${missionTitle}" for ${companyName} has been completed`,
      { companyName, missionTitle }
    );
  }

  async notifyRatingReceived(userId: string, fromUserName: string, rating: number): Promise<Notification> {
    return this.createNotification(
      userId,
      'RATING_RECEIVED',
      'New Rating Received',
      `${fromUserName} has given you a ${rating}-star rating`,
      { fromUserName, rating }
    );
  }

  async notifyMissionUpdated(userId: string, missionTitle: string, updateType: string): Promise<Notification> {
    return this.createNotification(
      userId,
      'MISSION_UPDATED',
      'Mission Updated',
      `Your mission "${missionTitle}" has been updated: ${updateType}`,
      { missionTitle, updateType }
    );
  }
} 
