const { query } = require('../../config/db');

const tableName = 'maintenance_requests';

async function findAll() {
  try {
    const result = await query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch maintenance requests: ${error.message}`);
  }
}

async function findById(id) {
  try {
    const result = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch maintenance request: ${error.message}`);
  }
}

async function create(data) {
  try {
    const result = await query(
      `INSERT INTO ${tableName} (asset_id, employee_id, title, description, status, requested_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [
        data.asset_id ?? data.assetId,
        data.employee_id ?? data.employeeId,
        data.title,
        data.description ?? null,
        data.status ?? 'pending',
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create maintenance request: ${error.message}`);
  }
}

async function update(id, data) {
  try {
    const result = await query(
      `UPDATE ${tableName}
       SET asset_id = COALESCE($2, asset_id),
           employee_id = COALESCE($3, employee_id),
           title = COALESCE($4, title),
           description = COALESCE($5, description),
           status = COALESCE($6, status),
           updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, data.asset_id ?? data.assetId ?? null, data.employee_id ?? data.employeeId ?? null, data.title ?? null, data.description ?? null, data.status ?? null]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to update maintenance request: ${error.message}`);
  }
}

async function remove(id) {
  try {
    const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);
    return result.rowCount > 0;
  } catch (error) {
    throw new Error(`Failed to delete maintenance request: ${error.message}`);
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
