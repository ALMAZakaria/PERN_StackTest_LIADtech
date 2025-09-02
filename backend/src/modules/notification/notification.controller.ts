import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { ResponseUtil } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  getUserNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const notifications = await this.notificationService.getUserNotifications(userId, limit);
      ResponseUtil.success(res, notifications, 'Notifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const count = await this.notificationService.getUnreadCount(userId);
      ResponseUtil.success(res, { count }, 'Unread count retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.params;
      await this.notificationService.markAsRead(userId, notificationId);
      ResponseUtil.success(res, null, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.notificationService.markAllAsRead(userId);
      ResponseUtil.success(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  };

  deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.params;
      await this.notificationService.deleteNotification(userId, notificationId);
      ResponseUtil.success(res, null, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  clearOldNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const daysOld = req.query.daysOld ? parseInt(req.query.daysOld as string) : 30;
      await this.notificationService.clearOldNotifications(userId, daysOld);
      ResponseUtil.success(res, null, 'Old notifications cleared successfully');
    } catch (error) {
      next(error);
    }
  };
} 
