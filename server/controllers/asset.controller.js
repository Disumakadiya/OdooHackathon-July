import pool from "../config/db.js";

const VALID_STATUSES = ["Available", "Allocated", "Under Maintenance", "Retired"];
const STATUS_ALIASES = {
  Maintenance: "Under Maintenance",
  "In Maintenance": "Under Maintenance",
};
const ALLOWED_TRANSITIONS = {
  Available: ["Allocated", "Under Maintenance", "Retired"],
  Allocated: ["Available", "Under Maintenance"],
  "Under Maintenance": ["Available", "Retired"],
  Retired: [],
};

function normalizeStatus(status) {
  if (!status) return undefined;
  return STATUS_ALIASES[status] || status;
}

function validateStatus(status) {
  return VALID_STATUSES.includes(status);
}

function canTransition(fromStatus, toStatus) {
  if (fromStatus === toStatus) return true;
  return ALLOWED_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function isUniqueViolation(error) {
  return error.code === "23505";
}

async function reserveNextAssetIdentity(client) {
  const result = await client.query(
    "SELECT nextval(pg_get_serial_sequence('assets', 'id')) AS id",
  );
  const id = Number(result.rows[0].id);
  return { id, assetTag: `AF-${String(id).padStart(4, "0")}` };
}

async function findAsset(id, client = pool) {
  const result = await client.query("SELECT * FROM assets WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function getAssetView(id, client = pool) {
  const result = await client.query(
    `SELECT a.*, c.name as category_name, COALESCE(e.name, a.assigned_employee) as assigned_employee
     FROM assets a
     LEFT JOIN asset_categories c ON a.category_id = c.id
     LEFT JOIN employees e ON a.assigned_employee_id = e.id
     WHERE a.id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

export const getAllAssets = async (req, res) => {
  const { search, status, category_id } = req.query;
  const filters = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(a.asset_tag ILIKE $${values.length} OR a.asset_name ILIKE $${values.length} OR a.location ILIKE $${values.length})`);
  }

  const normalizedStatus = normalizeStatus(status);
  if (normalizedStatus) {
    if (!validateStatus(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid asset status" });
    }
    values.push(normalizedStatus);
    filters.push(`a.status = $${values.length}`);
  }

  if (category_id) {
    values.push(category_id);
    filters.push(`a.category_id = $${values.length}`);
  }

  try {
    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const result = await pool.query(
      `SELECT a.*, c.name as category_name, COALESCE(e.name, a.assigned_employee) as assigned_employee
       FROM assets a
       LEFT JOIN asset_categories c ON a.category_id = c.id
       LEFT JOIN employees e ON a.assigned_employee_id = e.id
       ${whereClause}
       ORDER BY a.created_at DESC, a.id DESC`,
      values,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const asset = await getAssetView(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAsset = async (req, res) => {
  const client = await pool.connect();
  const { asset_tag, asset_name, category_id, location, purchase_date } = req.body;
  const status = normalizeStatus(req.body.status) || "Available";
  const cost = toNumberOrNull(req.body.cost) ?? 0;

  if (!asset_name?.trim()) {
    client.release();
    return res.status(400).json({ message: "Asset name is required" });
  }

  if (!validateStatus(status)) {
    client.release();
    return res.status(400).json({ message: "Invalid asset status" });
  }

  if (Number.isNaN(cost) || cost < 0) {
    client.release();
    return res.status(400).json({ message: "Asset cost must be a positive number" });
  }

  try {
    await client.query("BEGIN");

    const duplicate = await client.query(
      `SELECT id FROM assets
       WHERE LOWER(asset_name) = LOWER($1)
         AND COALESCE(category_id, 0) = COALESCE($2::int, 0)
         AND COALESCE(location, '') = COALESCE($3, '')
       LIMIT 1`,
      [asset_name.trim(), category_id || null, location?.trim() || ""],
    );
    if (duplicate.rows.length) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Duplicate asset already exists" });
    }

    const reservedIdentity = asset_tag?.trim() ? null : await reserveNextAssetIdentity(client);
    const finalAssetTag = asset_tag?.trim() || reservedIdentity.assetTag;
    const idColumns = reservedIdentity ? "id, " : "";
    const idValues = reservedIdentity ? "$1, " : "";
    const offset = reservedIdentity ? 1 : 0;
    const result = await client.query(
      `INSERT INTO assets (${idColumns}asset_tag, asset_name, category_id, status, location, purchase_date, cost)
       VALUES (${idValues}$${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})
       RETURNING *`,
      reservedIdentity ? [
        reservedIdentity.id,
        finalAssetTag,
        asset_name.trim(),
        category_id || null,
        status,
        location?.trim() || "",
        purchase_date || null,
        cost,
      ] : [
        finalAssetTag,
        asset_name.trim(),
        category_id || null,
        status,
        location?.trim() || "",
        purchase_date || null,
        cost,
      ],
    );

    await client.query("COMMIT");
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: "Asset tag already exists" });
    }
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const updateAsset = async (req, res) => {
  const client = await pool.connect();
  const { asset_name, category_id, location, purchase_date } = req.body;
  const status = normalizeStatus(req.body.status);
  const cost = toNumberOrNull(req.body.cost);

  if (asset_name !== undefined && !asset_name.trim()) {
    client.release();
    return res.status(400).json({ message: "Asset name cannot be empty" });
  }

  if (status && !validateStatus(status)) {
    client.release();
    return res.status(400).json({ message: "Invalid asset status" });
  }

  if (Number.isNaN(cost) || cost < 0) {
    client.release();
    return res.status(400).json({ message: "Asset cost must be a positive number" });
  }

  try {
    await client.query("BEGIN");
    const current = await findAsset(req.params.id, client);
    if (!current) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Asset not found" });
    }

    if (status && !canTransition(current.status, status)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: `Invalid status transition from ${current.status} to ${status}` });
    }

    const result = await client.query(
      `UPDATE assets
       SET asset_name = COALESCE($1, asset_name),
           category_id = COALESCE($2, category_id),
           status = COALESCE($3, status),
           location = COALESCE($4, location),
           purchase_date = COALESCE($5, purchase_date),
           cost = COALESCE($6, cost)
       WHERE id = $7
       RETURNING *`,
      [
        asset_name?.trim(),
        category_id || null,
        status,
        location?.trim(),
        purchase_date || null,
        cost,
        req.params.id,
      ],
    );

    await client.query("COMMIT");
    res.status(200).json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: "Asset tag already exists" });
    }
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM assets WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: "Asset not found" });
    res.status(200).json({ success: true, id: Number(req.params.id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const allocateAsset = async (req, res) => {
  const client = await pool.connect();
  const { employee_id, expected_return_date, location } = req.body;

  const employeeId = toNumberOrNull(employee_id);
  if (!employeeId || Number.isNaN(employeeId)) {
    client.release();
    return res.status(400).json({ message: "employee_id is required" });
  }

  try {
    await client.query("BEGIN");
    const current = await findAsset(req.params.id, client);
    if (!current) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Asset not found" });
    }
    if (!canTransition(current.status, "Allocated")) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: `Invalid status transition from ${current.status} to Allocated` });
    }

    const alloc = await client.query(
      "INSERT INTO asset_allocations (asset_id, employee_id, expected_return_date) VALUES ($1, $2, $3) RETURNING *",
      [req.params.id, employeeId, expected_return_date || null],
    );
    await client.query(
      `UPDATE assets
       SET status = $1,
           assigned_employee_id = $2,
           location = COALESCE($3, location)
       WHERE id = $4`,
      ["Allocated", employeeId, location?.trim() || null, req.params.id],
    );
    const asset = await getAssetView(req.params.id, client);
    await client.query("COMMIT");
    res.status(200).json({ allocation: alloc.rows[0], asset });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const transferAsset = async (req, res) => {
  const client = await pool.connect();
  const { to_employee_id, location, to_department, to_location } = req.body;
  const toEmployeeId = toNumberOrNull(to_employee_id);

  if ((toEmployeeId !== null && Number.isNaN(toEmployeeId)) || (!toEmployeeId && !location?.trim())) {
    client.release();
    return res.status(400).json({ message: "Transfer target employee or location is required" });
  }

  try {
    await client.query("BEGIN");
    const current = await findAsset(req.params.id, client);
    if (!current) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Asset not found" });
    }
    if (current.status === "Retired") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Retired assets cannot be transferred" });
    }

    const finalToLocation = to_location?.trim() || location?.trim() || null;
    const transfer = await client.query(
      `INSERT INTO asset_transfers (asset_id, from_employee_id, to_employee_id, status, from_department, to_department, from_location, to_location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.params.id, current.assigned_employee_id || null, toEmployeeId || null, "Approved",
       current.department || null, to_department?.trim() || null, current.location || null, finalToLocation],
    );
    await client.query(
      `UPDATE assets
       SET status = CASE WHEN $1::int IS NULL THEN status ELSE 'Allocated' END,
           assigned_employee_id = COALESCE($1, assigned_employee_id),
           location = COALESCE($2, location),
           department = COALESCE($3, department)
       WHERE id = $4`,
      [toEmployeeId || null, finalToLocation, to_department?.trim() || null, req.params.id],
    );
    const asset = await getAssetView(req.params.id, client);
    await client.query("COMMIT");
    res.status(200).json({ transfer: transfer.rows[0], asset });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const returnAsset = async (req, res) => {
  const client = await pool.connect();
  const { condition, notes, employee_id } = req.body;

  try {
    await client.query("BEGIN");
    const current = await findAsset(req.params.id, client);
    if (!current) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Asset not found" });
    }
    if (!canTransition(current.status, "Available")) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: `Invalid status transition from ${current.status} to Available` });
    }

    const ret = await client.query(
      "INSERT INTO asset_returns (asset_id, employee_id, condition, notes) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, employee_id || current.assigned_employee_id || null, condition || "Good", notes || null],
    );
    await client.query(
      `UPDATE assets
       SET status = $1,
           assigned_employee_id = NULL
       WHERE id = $2`,
      ["Available", req.params.id],
    );
    const asset = await getAssetView(req.params.id, client);
    await client.query("COMMIT");
    res.status(200).json({ return: ret.rows[0], asset });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const getEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id, e.name, e.email, d.name AS department, r.name AS role
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN roles r ON e.role_id = r.id
       ORDER BY e.name ASC`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllocations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT al.id, al.asset_id, a.asset_tag, a.asset_name, al.employee_id,
              COALESCE(e.name, al.employee_name) AS employee_name,
              al.allocation_date, al.expected_return_date, al.status, al.action, al.details
       FROM asset_allocations al
       LEFT JOIN assets a ON al.asset_id = a.id
       LEFT JOIN employees e ON al.employee_id = e.id
       ORDER BY al.allocation_date DESC, al.id DESC`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransfers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tr.id, tr.asset_id, a.asset_tag, a.asset_name,
              COALESCE(fe.name, tr.from_department, tr.from_location) AS from_label,
              COALESCE(te.name, tr.to_department, tr.to_location) AS to_label,
              tr.from_department, tr.to_department, tr.from_location, tr.to_location,
              tr.transfer_date, tr.status
       FROM asset_transfers tr
       LEFT JOIN assets a ON tr.asset_id = a.id
       LEFT JOIN employees fe ON tr.from_employee_id = fe.id
       LEFT JOIN employees te ON tr.to_employee_id = te.id
       ORDER BY tr.transfer_date DESC, tr.id DESC`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReturns = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rt.id, rt.asset_id, a.asset_tag, a.asset_name, rt.employee_id,
              COALESCE(e.name, 'Unassigned') AS employee_name,
              rt.return_date, rt.condition, rt.notes
       FROM asset_returns rt
       LEFT JOIN assets a ON rt.asset_id = a.id
       LEFT JOIN employees e ON rt.employee_id = e.id
       ORDER BY rt.return_date DESC, rt.id DESC`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
