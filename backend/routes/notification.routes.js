const express = require('express');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

router.get('/', notificationController.getNotifications);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);


module.exports = router;
