const notificationService = require('../services/notification.service');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications();
    res.status(200).json({ success: true, message: 'Notifications retrieved successfully', data: notifications });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    next(error);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const notifications = await notificationService.markAllRead();
    res.status(200).json({ success: true, message: 'All notifications marked as read', data: notifications });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};
