import pool from "../config/db.js";

const TABLE = "asset_categories";

export async function getAll() {
  const result = await pool.query(`SELECT * FROM ${TABLE} ORDER BY name ASC`);
  return result.rows;
}

export async function getById(id) {
  const result = await pool.query(`SELECT * FROM ${TABLE} WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function create(data) {
  const { name, description } = data;
  const result = await pool.query(
    `INSERT INTO ${TABLE} (name, description, created_at) VALUES ($1, $2, NOW()) RETURNING *`,
    [name, description || null]
  );
  return result.rows[0];
}

export async function update(id, data) {
  const { name, description } = data;
  const result = await pool.query(
    `UPDATE ${TABLE} SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *`,
    [name, description, id]
  );
  return result.rows[0] || null;
}

export async function remove(id) {
  const result = await pool.query(`DELETE FROM ${TABLE} WHERE id = $1 RETURNING id`, [id]);
  return result.rowCount > 0;
}
