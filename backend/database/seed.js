import pool from "../config/db.js";

// ============================================================
// AssetFlow seed data — fills asset_categories, assets,
// asset_allocations, asset_transfers, asset_returns.
// Idempotent: safe to run multiple times (skips existing rows).
// Run: node database/seed.js
// ============================================================

const CATEGORIES = [
  { name: "Laptops", description: "Portable personal computers" },
  { name: "Monitors", description: "Display screens for workstations" },
  { name: "Accessories", description: "Peripheral devices and add-ons" },
  { name: "Furniture", description: "Office desks, chairs, and storage" },
  { name: "Office Equipment", description: "Printers, scanners and MFDs" },
];

const ASSETS = [
  {
    asset_tag: "TAG-001",
    asset_name: "MacBook Pro M3",
    category: "Laptops",
    department: "IT",
    location: "HQ-IT",
    serial_number: "MVP3-NLK-2025-001",
    description: "Apple M3 Pro 16-inch for the engineering team.",
    assigned_employee: "Unassigned",
    condition: "Good",
    purchase_date: "2024-06-01",
    cost: 2499.0,
  },
  {
    asset_tag: "TAG-002",
    asset_name: "Dell XPS 15",
    category: "Laptops",
    department: "Sales",
    location: "HQ-Sales",
    serial_number: "DELL-XPS15-8841",
    description: "Regional sales lead's primary work laptop.",
    assigned_employee: "Ananya Kapoor",
    condition: "Good",
    purchase_date: "2024-03-15",
    cost: 1899.0,
  },
  {
    asset_tag: "TAG-003",
    asset_name: "LG 4K Monitor",
    category: "Monitors",
    department: "IT",
    location: "HQ-IT",
    serial_number: "LGK-42UHD-88",
    description: "27-inch 4K UHD monitor for dual-screen setup.",
    assigned_employee: "Unassigned",
    condition: "Good",
    purchase_date: "2023-11-20",
    cost: 549.0,
  },
  {
    asset_tag: "TAG-004",
    asset_name: "Logitech MX Master 3",
    category: "Accessories",
    department: "Operations",
    location: "Repair Center",
    serial_number: "MX-8844-771",
    description: "Wireless mouse with scrolling issue, sent for repair.",
    assigned_employee: "Unassigned",
    condition: "Damaged",
    purchase_date: "2024-02-14",
    cost: 99.99,
  },
];

const ALLOCATIONS = [
  {
    asset_id: 2,
    employee_name: "Ananya Kapoor",
    action: "Allocated",
    allocation_date: "2026-07-15",
    status: "Active",
    details: "Allocated to regional sales lead.",
  },
  {
    asset_id: 1,
    employee_name: "Rahul Menon",
    action: "Allocated",
    allocation_date: "2026-06-01",
    expected_return_date: "2026-07-10",
    status: "Returned",
    details: "Temporary assignment on the migration project.",
  },
  {
    asset_id: 3,
    employee_name: "Rahul Menon",
    action: "Allocated",
    allocation_date: "2026-05-20",
    expected_return_date: "2026-06-15",
    status: "Returned",
    details: "Loaned while waiting for new hardware.",
  },
];

const TRANSFERS = [
  {
    asset_id: 1,
    from_department: "IT",
    from_location: "HQ-IT",
    to_department: "Sales",
    to_location: "HQ-Sales",
    transfer_date: "2026-06-01",
    status: "Completed",
  },
  {
    asset_id: 3,
    from_department: "IT",
    from_location: "HQ-IT",
    to_location: "Warehouse A",
    transfer_date: "2026-08-01",
    status: "Pending",
  },
];

const RETURNS = [
  {
    asset_id: 1,
    return_date: "2026-07-10",
    condition: "Good",
    notes: "Returned at the end of the assignment.",
  },
  {
    asset_id: 3,
    return_date: "2026-06-15",
    condition: "Good",
    notes: "Returned to the IT equipment pool.",
  },
];

async function rowCount(table, where, params) {
  const r = await pool.query(`SELECT COUNT(*)::int AS n FROM ${table} WHERE ${where}`, params);
  return r.rows[0].n;
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Categories (upsert by unique name)
    for (const c of CATEGORIES) {
      await client.query(
        `INSERT INTO asset_categories (name, description, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (name) DO NOTHING`,
        [c.name, c.description]
      );
    }

    // 2. Assets — fill missing business fields
    for (const a of ASSETS) {
      await client.query(
        `UPDATE assets
         SET category = COALESCE(NULLIF($2, ''), category),
             category_id = (SELECT id FROM asset_categories WHERE name = $2),
             department = COALESCE(NULLIF($3, ''), department),
             serial_number = COALESCE(NULLIF($4, ''), serial_number),
             assigned_employee = COALESCE(NULLIF($5, ''), assigned_employee),
             condition = COALESCE(NULLIF($6, ''), condition),
             description = COALESCE(NULLIF($7, ''), description),
             purchase_date = COALESCE($8::date, purchase_date),
             cost = COALESCE($9::numeric, cost),
             last_updated = NOW()
         WHERE asset_tag = $1`,
        [a.asset_tag, a.category, a.department, a.serial_number, a.assigned_employee, a.condition, a.description, a.purchase_date, a.cost]
      );
    }

    // 3. Allocations
    for (const al of ALLOCATIONS) {
      const n = await rowCount(
        "asset_allocations",
        "asset_id = $1 AND employee_name = $2 AND action = $3 AND status = $4",
        [al.asset_id, al.employee_name, al.action, al.status]
      );
      if (n === 0) {
        await client.query(
          `INSERT INTO asset_allocations (asset_id, employee_name, action, allocation_date, expected_return_date, details, status)
           VALUES ($1, $2, $3, $4::timestamp, $5::date, $6, $7)`,
          [al.asset_id, al.employee_name, al.action, al.allocation_date, al.expected_return_date ?? null, al.details, al.status]
        );
      }
    }

    // 4. Transfers
    for (const t of TRANSFERS) {
      const n = await rowCount(
        "asset_transfers",
        "asset_id = $1 AND status = $2",
        [t.asset_id, t.status]
      );
      if (n === 0) {
        await client.query(
          `INSERT INTO asset_transfers (asset_id, from_department, from_location, to_department, to_location, transfer_date, status)
           VALUES ($1, $2, $3, $4, $5, $6::timestamp, $7)`,
          [t.asset_id, t.from_department, t.from_location, t.to_department, t.to_location, t.transfer_date, t.status]
        );
      }
    }

    // 5. Returns
    for (const r of RETURNS) {
      const n = await rowCount(
        "asset_returns",
        "asset_id = $1 AND return_date::date = $2::date",
        [r.asset_id, r.return_date]
      );
      if (n === 0) {
        await client.query(
          `INSERT INTO asset_returns (asset_id, return_date, condition, notes)
           VALUES ($1, $2::timestamp, $3, $4)`,
          [r.asset_id, r.return_date, r.condition, r.notes]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Seed data applied successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err.message);
  } finally {
    client.release();
  }
}

seed().then(() => process.exit(0));