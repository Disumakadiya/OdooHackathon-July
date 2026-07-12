const { query } = require('../../config/db');

const tableName = 'notifications';

async function findAll() {
  try {
    const result = await query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
}

async function findById(id) {
  try {
    const result = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch notification: ${error.message}`);
  }
}

async function create(data) {
  try {
    const result = await query(
      `INSERT INTO ${tableName} (user_id, title, message, type, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [
        data.user_id ?? data.userId ?? null,
        data.title ?? null,
        data.message ?? null,
        data.type ?? 'info',
        data.is_read ?? data.isRead ?? false,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
}

async function update(id, data) {
  try {
    const result = await query(
      `UPDATE ${tableName}
       SET user_id = COALESCE($2, user_id),
           title = COALESCE($3, title),
           message = COALESCE($4, message),
           type = COALESCE($5, type),
           is_read = COALESCE($6, is_read),
           updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [
        id,
        data.user_id ?? data.userId ?? null,
        data.title ?? null,
        data.message ?? null,
        data.type ?? null,
        data.is_read ?? data.isRead ?? null,
      ]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to update notification: ${error.message}`);
  }
}

async function remove(id) {
  try {
    const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);
    return result.rowCount > 0;
  } catch (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
