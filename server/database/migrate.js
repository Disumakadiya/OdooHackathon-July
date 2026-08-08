import pool from "../config/db.js";

const MIGRATIONS = [
  // Add columns to assets table
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100)`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS qr_code VARCHAR(100)`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS category VARCHAR(100)`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS department VARCHAR(100)`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS description TEXT`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS assigned_employee VARCHAR(150) DEFAULT 'Unassigned'`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS condition VARCHAR(50) DEFAULT 'Good'`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,

  // Add columns to asset_allocations
  `ALTER TABLE asset_allocations ADD COLUMN IF NOT EXISTS employee_name VARCHAR(150)`,
  `ALTER TABLE asset_allocations ADD COLUMN IF NOT EXISTS action VARCHAR(100)`,
  `ALTER TABLE asset_allocations ADD COLUMN IF NOT EXISTS details TEXT`,

  // Add columns to asset_transfers
  `ALTER TABLE asset_transfers ADD COLUMN IF NOT EXISTS from_department VARCHAR(100)`,
  `ALTER TABLE asset_transfers ADD COLUMN IF NOT EXISTS to_department VARCHAR(100)`,
  `ALTER TABLE asset_transfers ADD COLUMN IF NOT EXISTS from_location VARCHAR(100)`,
  `ALTER TABLE asset_transfers ADD COLUMN IF NOT EXISTS to_location VARCHAR(100)`,

  // Add columns to notifications
  `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(30) DEFAULT 'info'`,

  // Add columns to audit_cycles
  `ALTER TABLE audit_cycles ADD COLUMN IF NOT EXISTS department VARCHAR(100)`,
  `ALTER TABLE audit_cycles ADD COLUMN IF NOT EXISTS auditor VARCHAR(150)`,
];

async function runMigrations() {
  const client = await pool.connect();
  try {
    for (const sql of MIGRATIONS) {
      try {
        await client.query(sql);
        console.log(`OK: ${sql.split("ADD COLUMN IF NOT EXISTS")[1]?.trim().split(" ")[0] || sql.substring(0, 60)}`);
      } catch (err) {
        console.log(`SKIP: ${err.message.substring(0, 80)}`);
      }
    }
    console.log("\nMigrations complete.");
  } finally {
    client.release();
  }
}

runMigrations().then(() => process.exit(0));
