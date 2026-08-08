import pool from "../config/db.js";

const TABLE = "assets";
const VALID_STATUSES = ["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"];
const VALID_CONDITIONS = ["Good", "Fair", "Damaged"];
const TRANSITIONS = {
  Available: ["Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"],
  Allocated: ["Available", "Reserved", "Under Maintenance", "Lost"],
  Reserved: ["Available", "Allocated", "Under Maintenance"],
  "Under Maintenance": ["Available", "Retired", "Disposed"],
  Lost: ["Available", "Retired"],
  Retired: ["Disposed"],
  Disposed: [],
};

function httpError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function assertRequired(data) {
  const required = {
    name: "Asset name is required",
    category: "Category is required",
    department: "Department is required",
    location: "Location is required",
  };

  for (const [field, message] of Object.entries(required)) {
    if (!String(data[field] ?? "").trim()) {
      throw httpError(message, 400);
    }
  }
}

function assertEnums(data) {
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    throw httpError(`Status must be one of: ${VALID_STATUSES.join(", ")}`, 400);
  }
  if (data.condition && !VALID_CONDITIONS.includes(data.condition)) {
    throw httpError(`Condition must be one of: ${VALID_CONDITIONS.join(", ")}`, 400);
  }
}

function assertTransition(currentStatus, nextStatus) {
  if (!nextStatus || nextStatus === currentStatus) return;
  const allowed = TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw httpError(`Invalid status transition from ${currentStatus} to ${nextStatus}`, 409);
  }
}

function normalizeTag(value) {
  const trimmed = String(value || "").trim().toUpperCase();
  return trimmed || null;
}

async function generateAssetTag(client) {
  const result = await client.query(
    `SELECT asset_tag
     FROM ${TABLE}
     WHERE asset_tag ~ '^AF-[0-9]{4}$'
     ORDER BY CAST(SUBSTRING(asset_tag FROM 4) AS INTEGER) DESC
     LIMIT 1`
  );
  const lastNumber = result.rows[0]?.asset_tag ? Number(result.rows[0].asset_tag.slice(3)) : 0;
  return `AF-${String(lastNumber + 1).padStart(4, "0")}`;
}

async function assertUniqueAsset(client, { assetTag, serialNumber }, excludeId = null) {
  if (assetTag) {
    const result = await client.query(
      `SELECT id FROM ${TABLE} WHERE asset_tag = $1 AND ($2::int IS NULL OR id <> $2)`,
      [assetTag, excludeId]
    );
    if (result.rowCount > 0) throw httpError("Asset tag already exists", 409);
  }

  if (serialNumber) {
    const result = await client.query(
      `SELECT id FROM ${TABLE} WHERE serial_number = $1 AND ($2::int IS NULL OR id <> $2)`,
      [serialNumber, excludeId]
    );
    if (result.rowCount > 0) throw httpError("Serial number already exists", 409);
  }
}

export async function getAll() {
  const result = await pool.query(
    `SELECT a.*, c.name AS category_name
     FROM ${TABLE} a
     LEFT JOIN asset_categories c ON a.category_id = c.id
     ORDER BY a.created_at DESC`
  );
  return result.rows;
}

export async function getById(id) {
  const result = await pool.query(
    `SELECT a.*, c.name AS category_name
     FROM ${TABLE} a
     LEFT JOIN asset_categories c ON a.category_id = c.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function create(data) {
  assertRequired(data);
  assertEnums(data);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const assetTag = normalizeTag(data.assetTag) || await generateAssetTag(client);
    const serialNumber = String(data.serialNumber || "").trim() || null;
    await assertUniqueAsset(client, { assetTag, serialNumber });

    const result = await client.query(
      `INSERT INTO ${TABLE}
       (asset_tag, asset_name, serial_number, qr_code, category, status, department, location, assigned_employee, condition, description, last_updated, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
       RETURNING *`,
      [
        assetTag,
        String(data.name).trim(),
        serialNumber,
        String(data.qrCode || "").trim() || null,
        String(data.category).trim(),
        data.status || "Available",
        String(data.department).trim(),
        String(data.location).trim(),
        String(data.assignedEmployee || "").trim() || "Unassigned",
        data.condition || "Good",
        String(data.description || "").trim() || null,
      ]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") throw httpError("Duplicate asset value violates a unique constraint", 409);
    throw err;
  } finally {
    client.release();
  }
}

export async function update(id, data) {
  assertEnums(data);
  const existing = await getById(id);
  if (!existing) return null;
  assertTransition(existing.status, data.status);

  const fields = [];
  const values = [];
  let idx = 1;

  const fieldMap = {
    assetTag: "asset_tag",
    name: "asset_name",
    serialNumber: "serial_number",
    qrCode: "qr_code",
    category: "category",
    status: "status",
    department: "department",
    location: "location",
    assignedEmployee: "assigned_employee",
    condition: "condition",
    description: "description",
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      if (["assetTag", "name", "category", "department", "location"].includes(key) && !String(data[key]).trim()) {
        throw httpError(`${key} cannot be empty`, 400);
      }
      if (key === "assetTag") {
        const tag = normalizeTag(data[key]);
        if (!tag) throw httpError("assetTag cannot be empty", 400);
        fields.push(`asset_tag = $${idx++}`);
        values.push(tag);
      } else {
        fields.push(`${col} = $${idx++}`);
        values.push(data[key]);
      }
    }
  }

  if (fields.length === 0) return getById(id);

  await assertUniqueAsset(pool, {
    assetTag: data.assetTag !== undefined ? normalizeTag(data.assetTag) : null,
    serialNumber: data.serialNumber || null,
  }, Number(id));

  fields.push(`last_updated = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE ${TABLE} SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

export async function remove(id) {
  const result = await pool.query(`DELETE FROM ${TABLE} WHERE id = $1 RETURNING id`, [id]);
  return result.rowCount > 0;
}

export async function allocate(id, data) {
  const { assignedEmployee } = data;
  const existing = await getById(id);
  if (!existing) return null;
  assertTransition(existing.status, "Allocated");
  if (!String(assignedEmployee || "").trim()) throw httpError("assignedEmployee is required", 400);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE ${TABLE} SET status = 'Allocated', assigned_employee = $1, last_updated = NOW() WHERE id = $2 RETURNING *`,
      [String(assignedEmployee).trim(), id]
    );
    await client.query(
      `INSERT INTO asset_allocations (asset_id, employee_name, action, allocation_date, status)
       VALUES ($1, $2, 'Allocated', NOW(), 'Active')`,
      [id, String(assignedEmployee).trim()]
    );
    await client.query("COMMIT");
    return result.rows[0] || null;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function transferAsset(id, data) {
  const { department, location } = data;
  const existing = await getById(id);
  if (!existing) return null;
  assertTransition(existing.status, "Reserved");
  if (!String(department || location || "").trim()) throw httpError("department or location is required", 400);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE ${TABLE} SET status = 'Reserved', department = COALESCE($1, department), location = COALESCE($2, location), last_updated = NOW() WHERE id = $3 RETURNING *`,
      [department || null, location || null, id]
    );
    await client.query(
      `INSERT INTO asset_transfers (asset_id, to_department, to_location, transfer_date, status)
       VALUES ($1, $2, $3, NOW(), 'Pending')`,
      [id, department || null, location || null]
    );
    await client.query("COMMIT");
    return result.rows[0] || null;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function returnAsset(id, data) {
  const { condition } = data;
  assertEnums({ condition });
  const existing = await getById(id);
  if (!existing) return null;
  assertTransition(existing.status, "Available");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE ${TABLE} SET status = 'Available', assigned_employee = 'Unassigned', condition = COALESCE($1, condition), last_updated = NOW() WHERE id = $2 RETURNING *`,
      [condition || null, id]
    );
    await client.query(
      `INSERT INTO asset_returns (asset_id, return_date, condition)
       VALUES ($1, NOW(), $2)`,
      [id, condition || "Good"]
    );
    await client.query("COMMIT");
    return result.rows[0] || null;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getStats() {
  const result = await pool.query(`SELECT status, COUNT(*)::int AS count FROM ${TABLE} GROUP BY status`);
  const total = await pool.query(`SELECT COUNT(*)::int AS count FROM ${TABLE}`);
  const categories = await pool.query(`SELECT COUNT(DISTINCT category)::int AS count FROM ${TABLE} WHERE category IS NOT NULL`);
  return {
    totalAssets: total.rows[0]?.count || 0,
    totalCategories: categories.rows[0]?.count || 0,
    statusBreakdown: result.rows,
  };
}
