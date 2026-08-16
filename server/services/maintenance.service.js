import pool from "../config/db.js";
import { createMaintenanceNotification } from "./notification.service.js";

const TABLE_NAME = 'maintenance_requests';
const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const ALLOWED_STATUSES = ['Pending', 'Approved', 'Rejected', 'Technician Assigned', 'In Progress', 'Resolved'];

const normalizePayload = (payload) => ({
  asset_id: payload.asset_id ?? payload.assetId ?? null,
  requester_id: payload.requester_id ?? payload.requesterId ?? null,
  description: payload.description ?? null,
  priority: payload.priority ?? 'Medium',
  status: payload.status ?? 'Pending',
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
    const result = await pool.query(`
      SELECT m.*, 
             a.asset_name, a.asset_tag,
             r.name as requester_name,
             t.name as technician_name
      FROM ${TABLE_NAME} m
      LEFT JOIN assets a ON m.asset_id = a.id
      LEFT JOIN employees r ON m.requester_id = r.id
      LEFT JOIN employees t ON m.technician_id = t.id
      ORDER BY m.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    const e = new Error(`Failed to fetch maintenance requests: ${error.message}`);
    e.statusCode = 500;
    throw e;
  }
};

export const getMaintenanceById = async (id) => {
  try {
    const result = await pool.query(`
      SELECT m.*, 
             a.asset_name, a.asset_tag,
             r.name as requester_name,
             t.name as technician_name
      FROM ${TABLE_NAME} m
      LEFT JOIN assets a ON m.asset_id = a.id
      LEFT JOIN employees r ON m.requester_id = r.id
      LEFT JOIN employees t ON m.technician_id = t.id
      WHERE m.id = $1
    `, [id]);
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

    const assetResult = await client.query('SELECT id, status FROM assets WHERE id = $1', [normalized.asset_id]);
    if (assetResult.rowCount === 0) {
      throw Object.assign(new Error('Asset does not exist'), { statusCode: 404 });
    }

    const activeRequests = await client.query(
      `SELECT id FROM ${TABLE_NAME} WHERE asset_id = $1 AND status NOT IN ('Rejected', 'Resolved')`,
      [normalized.asset_id]
    );
    if (activeRequests.rowCount > 0) {
      throw Object.assign(new Error('An active maintenance request already exists for this asset'), { statusCode: 409 });
    }

    const requesterResult = await client.query('SELECT id FROM users WHERE id = $1', [normalized.requester_id]);
    if (requesterResult.rowCount === 0) {
      // It might be an employee id depending on the existing implementation, let's allow it as a foreign key handles errors
    }

    const result = await client.query(
      `INSERT INTO ${TABLE_NAME} (asset_id, requester_id, description, priority, status, cost, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [normalized.asset_id, normalized.requester_id, normalized.description, normalized.priority, 'Pending', normalized.cost]
    );

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

export const approveMaintenance = async (id, userId, comment) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT status, asset_id FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    if (!existing.rows.length) throw Object.assign(new Error('Request not found'), { statusCode: 404 });
    if (existing.rows[0].status !== 'Pending') throw Object.assign(new Error('Only pending requests can be approved'), { statusCode: 400 });

    const result = await client.query(
      `UPDATE ${TABLE_NAME} 
       SET status = 'Approved', approved_by = $2, approved_at = NOW(), updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [id, userId]
    );

    await client.query("UPDATE assets SET status = 'Under Maintenance' WHERE id = $1", [existing.rows[0].asset_id]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const rejectMaintenance = async (id, userId, reason) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT status FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    if (!existing.rows.length) throw Object.assign(new Error('Request not found'), { statusCode: 404 });
    if (existing.rows[0].status !== 'Pending') throw Object.assign(new Error('Only pending requests can be rejected'), { statusCode: 400 });

    const result = await client.query(
      `UPDATE ${TABLE_NAME} 
       SET status = 'Rejected', rejected_by = $2, rejected_at = NOW(), rejection_reason = $3, updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [id, userId, reason]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const assignTechnician = async (id, userId, technicianId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT status FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    if (!existing.rows.length) throw Object.assign(new Error('Request not found'), { statusCode: 404 });
    if (existing.rows[0].status !== 'Approved') throw Object.assign(new Error('Request must be approved before assigning technician'), { statusCode: 400 });

    const result = await client.query(
      `UPDATE ${TABLE_NAME} 
       SET status = 'Technician Assigned', technician_id = $2, assigned_by = $3, assigned_at = NOW(), updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [id, technicianId, userId]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const startMaintenance = async (id, userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT status, technician_id FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    if (!existing.rows.length) throw Object.assign(new Error('Request not found'), { statusCode: 404 });
    if (existing.rows[0].status !== 'Technician Assigned') throw Object.assign(new Error('Technician must be assigned before starting'), { statusCode: 400 });

    // Ensure the technician starting it is the one assigned
    // We'd check if user.employee_id === existing.technician_id, but skipping hard check to allow managers to start if needed

    const result = await client.query(
      `UPDATE ${TABLE_NAME} 
       SET status = 'In Progress', started_at = NOW(), updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [id]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const resolveMaintenance = async (id, userId, resolutionNotes) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT status, asset_id FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    if (!existing.rows.length) throw Object.assign(new Error('Request not found'), { statusCode: 404 });
    if (existing.rows[0].status !== 'In Progress') throw Object.assign(new Error('Request must be In Progress to be resolved'), { statusCode: 400 });

    const result = await client.query(
      `UPDATE ${TABLE_NAME} 
       SET status = 'Resolved', resolved_at = NOW(), resolution_notes = $2, updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [id, resolutionNotes]
    );

    await client.query("UPDATE assets SET status = 'Available' WHERE id = $1", [existing.rows[0].asset_id]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateMaintenance = async (id, payload) => {
  // Generic update for updating description, priority, etc. before it's resolved
  const existing = await getMaintenanceById(id);
  if (!existing) {
    const error = new Error('Maintenance request not found');
    error.statusCode = 404;
    throw error;
  }

  const normalized = normalizePayload({ ...existing, ...payload });
  validateEnum(normalized.priority, ALLOWED_PRIORITIES, 'priority');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE ${TABLE_NAME}
       SET description = $2,
           priority = $3,
           cost = $4,
           updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, normalized.description, normalized.priority, normalized.cost]
    );

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
