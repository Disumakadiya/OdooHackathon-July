const { pool } = require('../config/db');

const TABLE_NAME = 'notifications';

const createNotification = async ({ userId, title, message }) => {
  try {
    const result = await pool.query(
      `INSERT INTO ${TABLE_NAME} (user_id, title, message, is_read, created_at)
       VALUES ($1, $2, $3, FALSE, NOW()) RETURNING *`,
      [userId, title, message]
    );
    return result.rows[0];
  } catch (error) {
    const e = new Error(`Failed to create notification: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

exports.createNotification = createNotification;

exports.createBookingNotification = async ({ userId, action, bookingId }) => {
  const title = action === 'cancelled' ? 'Booking cancelled' : 'Booking created';
  const message = action === 'cancelled'
    ? `Booking ${bookingId} has been cancelled.`
    : `Booking ${bookingId} has been created successfully.`;

  return createNotification({ userId, title, message });
};

exports.createMaintenanceNotification = async ({ userId, action, requestId }) => {
  const title = action === 'resolved' ? 'Maintenance request resolved' : 'Maintenance request created';
  const message = action === 'resolved'
    ? `Maintenance request ${requestId} has been resolved.`
    : `Maintenance request ${requestId} has been created.`;

  return createNotification({ userId, title, message });
};

exports.getNotifications = async () => {
  try {
    const result = await pool.query(`SELECT * FROM ${TABLE_NAME} ORDER BY created_at DESC`);
    return result.rows;
  } catch (error) {
    const e = new Error(`Failed to fetch notifications: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

exports.markAsRead = async (id) => {
  try {
    const result = await pool.query(
      `UPDATE ${TABLE_NAME} SET is_read = TRUE WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const e = new Error(`Failed to mark notification as read: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

exports.markAllRead = async () => {
  try {
    const result = await pool.query(`UPDATE ${TABLE_NAME} SET is_read = TRUE WHERE is_read = FALSE RETURNING *`);
    return result.rows;
  } catch (error) {
    const e = new Error(`Failed to mark all notifications as read: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

exports.deleteNotification = async (id) => {
  try {
    const result = await pool.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }
    return true;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const e = new Error(`Failed to delete notification: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};
