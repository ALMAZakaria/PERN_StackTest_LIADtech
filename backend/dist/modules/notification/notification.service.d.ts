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
export declare class NotificationService {
    private notifications;
    private generateId;
    createNotification(userId: string, type: Notification['type'], title: string, message: string, data?: any): Promise<Notification>;
    getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(userId: string, notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
    deleteNotification(userId: string, notificationId: string): Promise<void>;
    clearOldNotifications(userId: string, daysOld?: number): Promise<void>;
    notifyApplicationReceived(companyUserId: string, freelancerName: string, missionTitle: string): Promise<Notification>;
    notifyApplicationAccepted(freelancerUserId: string, companyName: string, missionTitle: string): Promise<Notification>;
    notifyApplicationRejected(freelancerUserId: string, companyName: string, missionTitle: string): Promise<Notification>;
    notifyMissionCompleted(freelancerUserId: string, companyName: string, missionTitle: string): Promise<Notification>;
    notifyRatingReceived(userId: string, fromUserName: string, rating: number): Promise<Notification>;
    notifyMissionUpdated(userId: string, missionTitle: string, updateType: string): Promise<Notification>;
}
//# sourceMappingURL=notification.service.d.ts.map