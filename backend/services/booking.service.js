git pullconst { query, pool } = require('../config/db');
const { createBookingNotification } = require('./notification.service');


const TABLE_NAME = 'resource_bookings';

const normalizeBookingPayload = (payload) => ({
  asset_id: payload.asset_id ?? payload.assetId ?? null,
  employee_id: payload.employee_id ?? payload.employeeId ?? null,
  start_time: payload.start_time ?? payload.startTime ?? null,
  end_time: payload.end_time ?? payload.endTime ?? null,
  purpose: payload.purpose ?? null,
  status: payload.status ?? 'pending',
});

const validateBusinessRules = async ({ assetId, employeeId, startTime, endTime, bookingId = null }) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    const error = new Error('Invalid start or end time');
    error.statusCode = 400;
    throw error;
  }

  if (start < now) {
    const error = new Error('Bookings cannot be created in the past');
    error.statusCode = 400;
    throw error;
  }

  if (end <= start) {
    const error = new Error('End time must be after start time');
    error.statusCode = 400;
    throw error;
  }

  const assetResult = await query('SELECT id FROM assets WHERE id = $1', [assetId]);
  if (assetResult.rowCount === 0) {
    const error = new Error('Asset does not exist');
    error.statusCode = 404;
    throw error;
  }

  const employeeResult = await query('SELECT id FROM employees WHERE id = $1', [employeeId]);
  if (employeeResult.rowCount === 0) {
    const error = new Error('Employee does not exist');
    error.statusCode = 404;
    throw error;
  }

  const overlapResult = await query(
    `SELECT id FROM ${TABLE_NAME}
     WHERE asset_id = $1
       AND id <> COALESCE($2, -1)
       AND NOT (end_time <= $3 OR start_time >= $4)`,
    [assetId, bookingId, startTime, endTime]
  );

  if (overlapResult.rowCount > 0) {
    const error = new Error('Booking overlaps with an existing booking for this asset');
    error.statusCode = 409;
    throw error;
  }
};

exports.getAllBookings = async () => {
  try {
    const result = await query(`SELECT * FROM ${TABLE_NAME} ORDER BY start_time ASC`);
    return result.rows;
  } catch (error) {
    const e = new Error(`Failed to fetch bookings: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

exports.getBookingById = async (id) => {
  try {
    const result = await query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  } catch (error) {
    const e = new Error(`Failed to fetch booking: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

exports.createBooking = async (payload) => {
  const normalized = normalizeBookingPayload(payload);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Execute business rules using the same transaction connection to reduce race conditions.
    const now = new Date();
    const start = new Date(normalized.start_time);
    const end = new Date(normalized.end_time);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      const error = new Error('Invalid start or end time');
      error.statusCode = 400;
      throw error;
    }
    if (start < now) {
      const error = new Error('Bookings cannot be created in the past');
      error.statusCode = 400;
      throw error;
    }
    if (end <= start) {
      const error = new Error('End time must be after start time');
      error.statusCode = 400;
      throw error;
    }

    const assetResult = await client.query('SELECT id FROM assets WHERE id = $1', [normalized.asset_id]);
    if (assetResult.rowCount === 0) {
      const error = new Error('Asset does not exist');
      error.statusCode = 404;
      throw error;
    }

    const employeeResult = await client.query('SELECT id FROM employees WHERE id = $1', [normalized.employee_id]);
    if (employeeResult.rowCount === 0) {
      const error = new Error('Employee does not exist');
      error.statusCode = 404;
      throw error;
    }

    const overlapResult = await client.query(
      `SELECT id FROM ${TABLE_NAME}
       WHERE asset_id = $1
         AND id <> COALESCE($2, -1)
         AND NOT (end_time <= $3 OR start_time >= $4)`,
      [normalized.asset_id, null, normalized.start_time, normalized.end_time]
    );

    if (overlapResult.rowCount > 0) {
      const error = new Error('Booking overlaps with an existing booking for this asset');
      error.statusCode = 409;
      throw error;
    }

    const insertResult = await client.query(
      `INSERT INTO ${TABLE_NAME} (asset_id, employee_id, start_time, end_time, purpose, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [
        normalized.asset_id,
        normalized.employee_id,
        normalized.start_time,
        normalized.end_time,
        normalized.purpose,
        normalized.status,
      ]
    );

    await createBookingNotification({
      userId: normalized.employee_id,
      action: 'created',
      bookingId: insertResult.rows[0].id,
    });

    await client.query('COMMIT');
    return insertResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.statusCode) throw error;
    const e = new Error(`Failed to create booking: ${error.message}`);
    e.statusCode = 500;
    throw e;
  } finally {
    client.release();
  }
};


exports.updateBooking = async (id, payload) => {
  const existing = await exports.getBookingById(id);
  if (!existing) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  const normalized = normalizeBookingPayload({ ...existing, ...payload });

  await validateBusinessRules({
    assetId: normalized.asset_id,
    employeeId: normalized.employee_id,
    startTime: normalized.start_time,
    endTime: normalized.end_time,
    bookingId: id,
  });

  try {
    const result = await query(
      `UPDATE ${TABLE_NAME}
       SET asset_id = $2,
           employee_id = $3,
           start_time = $4,
           end_time = $5,
           purpose = $6,
           status = $7
       WHERE id = $1 RETURNING *`,
      [id, normalized.asset_id, normalized.employee_id, normalized.start_time, normalized.end_time, normalized.purpose, normalized.status]
    );
    return result.rows[0];
  } catch (error) {
    const e = new Error(`Failed to update booking: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

exports.deleteBooking = async (id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    await createBookingNotification({
      userId: null,
      action: 'cancelled',
      bookingId: id,
    });

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.statusCode) throw error;
    const e = new Error(`Failed to delete booking: ${error.message}`);
    e.statusCode = 500;
    throw e;
  } finally {
    client.release();
  }
};

