import pool from "../config/db.js";
const query = (text, params) => pool.query(text, params);
import {  createMaintenanceNotification  } from "./notification.service.js";

const TABLE_NAME = 'maintenance_requests';
const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const ALLOWED_STATUSES = ['Open', 'In Progress', 'Resolved'];

const normalizePayload = (payload) => ({
  asset_id: payload.asset_id ?? payload.assetId ?? null,
  requester_id: payload.requester_id ?? payload.requesterId ?? null,
  description: payload.description ?? null,
  priority: payload.priority ?? 'Medium',
  status: payload.status ?? 'Open',
  cost: payload.cost ?? null,
});

const validateEnum = (value, allowed, fieldName) => {
  if (value && !allowed.includes(value)) {
    const error = new Error(`${fieldName} must be one of: ${allowed.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
};

export const getAllMaintenances = async () => {
  try {
    const result = await pool.query(`SELECT * FROM ${TABLE_NAME} ORDER BY created_at DESC`);
    return result.rows;
  } catch (error) {
    const e = new Error(`Failed to fetch maintenance requests: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

export const getMaintenanceById = async (id) => {
  try {
    const result = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  } catch (error) {
    const e = new Error(`Failed to fetch maintenance request: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

export const createMaintenance = async (payload) => {
  const normalized = normalizePayload(payload);
  validateEnum(normalized.priority, ALLOWED_PRIORITIES, 'priority');
  validateEnum(normalized.status, ALLOWED_STATUSES, 'status');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const assetResult = await client.query('SELECT id FROM assets WHERE id = $1', [normalized.asset_id]);
    if (assetResult.rowCount === 0) {
      throw Object.assign(new Error('Asset does not exist'), { statusCode: 404 });
    }

    const requesterResult = await client.query('SELECT id FROM users WHERE id = $1', [normalized.requester_id]);
    if (requesterResult.rowCount === 0) {
      throw Object.assign(new Error('Requester does not exist'), { statusCode: 404 });
    }

    const result = await client.query(
      `INSERT INTO ${TABLE_NAME} (asset_id, requester_id, description, priority, status, cost, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [normalized.asset_id, normalized.requester_id, normalized.description, normalized.priority, normalized.status, normalized.cost]
    );

    await client.query("UPDATE assets SET status = 'Under Maintenance' WHERE id = $1", [normalized.asset_id]);
    await client.query('COMMIT');

    await createMaintenanceNotification({
      userId: normalized.requester_id,
      action: 'created',
      requestId: result.rows[0].id,
    });

    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.statusCode) {
      throw error;
    }
    const e = new Error(`Failed to create maintenance request: ${error.message}`);
    e.statusCode = 500;
    throw e;
  } finally {
    client.release();
  }
};

export const updateMaintenance = async (id, payload) => {
  const existing = await exports.getMaintenanceById(id);
  if (!existing) {
    const error = new Error('Maintenance request not found');
    error.statusCode = 404;
    throw error;
  }

  const normalized = normalizePayload({ ...existing, ...payload });
  validateEnum(normalized.priority, ALLOWED_PRIORITIES, 'priority');
  validateEnum(normalized.status, ALLOWED_STATUSES, 'status');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE ${TABLE_NAME}
       SET asset_id = $2,
           requester_id = $3,
           description = $4,
           priority = $5,
           status = $6,
           cost = $7,
           resolved_at = CASE WHEN $6 = 'Resolved' AND resolved_at IS NULL THEN NOW() ELSE resolved_at END
       WHERE id = $1 RETURNING *`,
      [id, normalized.asset_id, normalized.requester_id, normalized.description, normalized.priority, normalized.status, normalized.cost]
    );

    if (normalized.status === 'Resolved') {
      await client.query("UPDATE assets SET status = 'Available' WHERE id = $1", [normalized.asset_id]);
      await createMaintenanceNotification({
        userId: normalized.requester_id,
        action: 'resolved',
        requestId: result.rows[0].id,
      });
    } else {
      await client.query("UPDATE assets SET status = 'Under Maintenance' WHERE id = $1", [normalized.asset_id]);
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.statusCode) {
      throw error;
    }
    const e = new Error(`Failed to update maintenance request: ${error.message}`);
    e.statusCode = 500;
    throw e;
  } finally {
    client.release();
  }
};

export const deleteMaintenance = async (id) => {
  try {
    const result = await pool.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) {
      const error = new Error('Maintenance request not found');
      error.statusCode = 404;
      throw error;
    }
    return true;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    const e = new Error(`Failed to delete maintenance request: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};
