const { query } = require('../../config/db');

const tableName = 'resource_bookings';

async function findAll() {
  try {
    const result = await query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}

async function findById(id) {
  try {
    const result = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch booking: ${error.message}`);
  }
}

async function create(data) {
  try {
    const result = await query(
      `INSERT INTO ${tableName} (resource_id, employee_id, start_time, end_time, status, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [
        data.resource_id ?? data.resourceId,
        data.employee_id ?? data.employeeId,
        data.start_time ?? data.startTime,
        data.end_time ?? data.endTime,
        data.status ?? 'pending',
        data.notes ?? null,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }
}

async function update(id, data) {
  try {
    const result = await query(
      `UPDATE ${tableName}
       SET resource_id = COALESCE($2, resource_id),
           employee_id = COALESCE($3, employee_id),
           start_time = COALESCE($4, start_time),
           end_time = COALESCE($5, end_time),
           status = COALESCE($6, status),
           notes = COALESCE($7, notes),
           updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [
        id,
        data.resource_id ?? data.resourceId ?? null,
        data.employee_id ?? data.employeeId ?? null,
        data.start_time ?? data.startTime ?? null,
        data.end_time ?? data.endTime ?? null,
        data.status ?? null,
        data.notes ?? null,
      ]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }
}

async function remove(id) {
  try {
    const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);
    return result.rowCount > 0;
  } catch (error) {
    throw new Error(`Failed to delete booking: ${error.message}`);
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
