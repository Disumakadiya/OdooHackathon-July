import pool from "../config/db.js";

export const getAllAssets = async (req, res) => {
  try {
    const result = await pool.query('SELECT a.*, c.name as category_name FROM assets a LEFT JOIN asset_categories c ON a.category_id = c.id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assets WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAsset = async (req, res) => {
  const { asset_tag, asset_name, category_id, status, location, cost } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO assets (asset_tag, asset_name, category_id, status, location, cost) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [asset_tag || `TAG-${Date.now()}`, asset_name, category_id || null, status || 'Available', location || '', cost || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAsset = async (req, res) => {
  const { asset_name, status, location } = req.body;
  try {
    const result = await pool.query(
      'UPDATE assets SET asset_name = COALESCE($1, asset_name), status = COALESCE($2, status), location = COALESCE($3, location) WHERE id = $4 RETURNING *',
      [asset_name, status, location, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    await pool.query('DELETE FROM assets WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const allocateAsset = async (req, res) => {
  const { employee_id, expected_return_date } = req.body;
  try {
    await pool.query('BEGIN');
    const alloc = await pool.query(
      'INSERT INTO asset_allocations (asset_id, employee_id, expected_return_date) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, employee_id, expected_return_date]
    );
    const asset = await pool.query('UPDATE assets SET status = $1 WHERE id = $2 RETURNING *', ['Allocated', req.params.id]);
    await pool.query('COMMIT');
    res.json({ allocation: alloc.rows[0], asset: asset.rows[0] });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  }
};

export const transferAsset = async (req, res) => {
  const { to_employee_id, location } = req.body;
  try {
    await pool.query('BEGIN');
    const transfer = await pool.query(
      'INSERT INTO asset_transfers (asset_id, to_employee_id, status) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, to_employee_id, 'Approved']
    );
    const asset = await pool.query('UPDATE assets SET location = COALESCE($1, location) WHERE id = $2 RETURNING *', [location, req.params.id]);
    await pool.query('COMMIT');
    res.json({ transfer: transfer.rows[0], asset: asset.rows[0] });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  }
};

export const returnAsset = async (req, res) => {
  const { condition, notes } = req.body;
  try {
    await pool.query('BEGIN');
    const ret = await pool.query(
      'INSERT INTO asset_returns (asset_id, condition, notes) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, condition, notes]
    );
    const asset = await pool.query('UPDATE assets SET status = $1 WHERE id = $2 RETURNING *', ['Available', req.params.id]);
    await pool.query('COMMIT');
    res.json({ return: ret.rows[0], asset: asset.rows[0] });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  }
};
