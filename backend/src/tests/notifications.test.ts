import { NotificationService } from '../modules/notification/notification.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = new NotificationService();
  });

  describe('createNotification', () => {
    it('should create notification successfully', async () => {
      const notification = await notificationService.createNotification(
        'test-user-id',
        'APPLICATION_RECEIVED',
        'Test Title',
        'Test Message'
      );

      expect(notification.id).toBeDefined();
      expect(notification.userId).toBe('test-user-id');
      expect(notification.type).toBe('APPLICATION_RECEIVED');
      expect(notification.title).toBe('Test Title');
      expect(notification.message).toBe('Test Message');
      expect(notification.isRead).toBe(false);
      expect(notification.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getUserNotifications', () => {
    it('should return user notifications', async () => {
      // Create notifications in order
      await notificationService.createNotification(
        'test-user-id',
        'APPLICATION_RECEIVED',
        'Test 1',
        'Message 1'
      );

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      await notificationService.createNotification(
        'test-user-id',
        'MISSION_COMPLETED',
        'Test 2',
        'Message 2'
      );

      const notifications = await notificationService.getUserNotifications('test-user-id');

      expect(notifications.length).toBe(2);
      expect(notifications[0].title).toBe('Test 2'); // Most recent first
      expect(notifications[1].title).toBe('Test 1');
    });

    it('should respect limit parameter', async () => {
      // Create 5 notifications
      for (let i = 1; i <= 5; i++) {
        await notificationService.createNotification(
          'test-user-id',
          'APPLICATION_RECEIVED',
          `Test ${i}`,
          `Message ${i}`
        );
      }

      const notifications = await notificationService.getUserNotifications('test-user-id', 3);
      expect(notifications.length).toBe(3);
    });
  });

  describe('getUnreadCount', () => {
    it('should return correct unread count', async () => {
      // Create 3 notifications
      await notificationService.createNotification(
        'test-user-id',
        'APPLICATION_RECEIVED',
        'Test 1',
        'Message 1'
      );

      await notificationService.createNotification(
        'test-user-id',
        'MISSION_COMPLETED',
        'Test 2',
        'Message 2'
      );

      await notificationService.createNotification(
        'test-user-id',
        'RATING_RECEIVED',
        'Test 3',
        'Message 3'
      );

      const unreadCount = await notificationService.getUnreadCount('test-user-id');
      expect(unreadCount).toBe(3);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notification = await notificationService.createNotification(
        'test-user-id',
        'APPLICATION_RECEIVED',
        'Test Title',
        'Test Message'
      );

      await notificationService.markAsRead('test-user-id', notification.id);

      const unreadCount = await notificationService.getUnreadCount('test-user-id');
      expect(unreadCount).toBe(0);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      // Create multiple notifications
      await notificationService.createNotification(
        'test-user-id',
        'APPLICATION_RECEIVED',
        'Test 1',
        'Message 1'
      );

      await notificationService.createNotification(
        'test-user-id',
        'MISSION_COMPLETED',
        'Test 2',
        'Message 2'
      );

      await notificationService.markAllAsRead('test-user-id');

      const unreadCount = await notificationService.getUnreadCount('test-user-id');
      expect(unreadCount).toBe(0);
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const notification = await notificationService.createNotification(
        'test-user-id',
        'APPLICATION_RECEIVED',
        'Test Title',
        'Test Message'
      );

      await notificationService.deleteNotification('test-user-id', notification.id);

      const notifications = await notificationService.getUserNotifications('test-user-id');
      expect(notifications.length).toBe(0);
    });
  });

  describe('helper methods', () => {
    it('should create application received notification', async () => {
      const notification = await notificationService.notifyApplicationReceived(
        'company-user-id',
        'Alex Developer',
        'React Project'
      );

      expect(notification.type).toBe('APPLICATION_RECEIVED');
      expect(notification.title).toBe('New Application Received');
      expect(notification.message).toContain('Alex Developer');
      expect(notification.message).toContain('React Project');
    });

    it('should create rating received notification', async () => {
      const notification = await notificationService.notifyRatingReceived(
        'user-id',
        'John Company',
        5
      );

      expect(notification.type).toBe('RATING_RECEIVED');
      expect(notification.title).toBe('New Rating Received');
      expect(notification.message).toContain('John Company');
      expect(notification.message).toContain('5-star');
    });
  });
});
