import pool from "../config/db.js";

function isUniqueViolation(error) {
  return error.code === "23505";
}

export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(a.id)::int AS total_assets
       FROM asset_categories c
       LEFT JOIN assets a ON a.category_id = c.id
       GROUP BY c.id
       ORDER BY c.created_at DESC, c.id DESC`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ message: "Category name is required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO asset_categories (name, description) VALUES ($1, $2) RETURNING *",
      [name.trim(), description?.trim() || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ message: "Category name cannot be empty" });
  }
  try {
    const result = await pool.query(
      `UPDATE asset_categories
       SET name = COALESCE($1, name),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [name?.trim(), description?.trim() || null, req.params.id],
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM asset_categories WHERE id = $1 RETURNING id",
      [req.params.id],
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ success: true, id: Number(req.params.id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
