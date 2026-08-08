import pool from "../config/db.js";

const REQUIRED_TABLES = [
  "roles",
  "departments",
  "employees",
  "users",
  "asset_categories",
  "assets",
  "asset_allocations",
  "asset_transfers",
  "asset_returns",
  "resource_bookings",
  "maintenance_requests",
  "maintenance_approvals",
  "audit_cycles",
  "audit_items",
  "discrepancy_reports",
  "notifications",
  "activity_logs",
];

const CREATE_TABLES_SQL = `

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    department_head INT,
    status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_department_head'
  ) THEN
    ALTER TABLE departments
    ADD CONSTRAINT fk_department_head FOREIGN KEY (department_head) REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asset_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100),
    qr_code VARCHAR(100),
    category_id INT REFERENCES asset_categories(id) ON DELETE SET NULL,
    category VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Available',
    department VARCHAR(100),
    location VARCHAR(100),
    assigned_employee VARCHAR(150) DEFAULT 'Unassigned',
    condition VARCHAR(50) DEFAULT 'Good',
    description TEXT,
    purchase_date DATE,
    cost DECIMAL(10, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asset_allocations (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    allocated_by INT REFERENCES users(id) ON DELETE SET NULL,
    employee_name VARCHAR(150),
    action VARCHAR(100),
    allocation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_return_date DATE,
    details TEXT,
    status VARCHAR(30) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS asset_transfers (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    from_employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    to_employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    from_department VARCHAR(100),
    to_department VARCHAR(100),
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    requested_by INT REFERENCES users(id) ON DELETE SET NULL,
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS asset_returns (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    processed_by INT REFERENCES users(id) ON DELETE SET NULL,
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    condition VARCHAR(50),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS resource_bookings (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose TEXT,
    status VARCHAR(30) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    requester_id INT REFERENCES employees(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(30) DEFAULT 'Open',
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_approvals (
    id SERIAL PRIMARY KEY,
    maintenance_request_id INT REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    comments TEXT,
    status VARCHAR(30) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_cycles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    auditor VARCHAR(150),
    start_date DATE NOT NULL,
    end_date DATE,
    initiated_by INT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'Planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_items (
    id SERIAL PRIMARY KEY,
    audit_cycle_id INT REFERENCES audit_cycles(id) ON DELETE CASCADE,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'Pending',
    scanned_by INT REFERENCES employees(id) ON DELETE SET NULL,
    scanned_at TIMESTAMP,
    discrepancy_notes TEXT
);

CREATE TABLE IF NOT EXISTS discrepancy_reports (
    id SERIAL PRIMARY KEY,
    audit_cycle_id INT REFERENCES audit_cycles(id) ON DELETE SET NULL,
    asset_name VARCHAR(150),
    department VARCHAR(100),
    issue VARCHAR(100),
    assigned_to VARCHAR(150),
    status VARCHAR(30) DEFAULT 'Open',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    target_table VARCHAR(50) NOT NULL,
    target_id INT NOT NULL,
    details JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const MIGRATIONS = [
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100)`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS qr_code VARCHAR(100)`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS category VARCHAR(100)`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS department VARCHAR(100)`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS description TEXT`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS assigned_employee VARCHAR(150) DEFAULT 'Unassigned'`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS condition VARCHAR(50) DEFAULT 'Good'`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE asset_allocations ADD COLUMN IF NOT EXISTS employee_name VARCHAR(150)`,
  `ALTER TABLE asset_allocations ADD COLUMN IF NOT EXISTS action VARCHAR(100)`,
  `ALTER TABLE asset_allocations ADD COLUMN IF NOT EXISTS details TEXT`,
  `ALTER TABLE asset_transfers ADD COLUMN IF NOT EXISTS from_department VARCHAR(100)`,
  `ALTER TABLE asset_transfers ADD COLUMN IF NOT EXISTS to_department VARCHAR(100)`,
  `ALTER TABLE asset_transfers ADD COLUMN IF NOT EXISTS from_location VARCHAR(100)`,
  `ALTER TABLE asset_transfers ADD COLUMN IF NOT EXISTS to_location VARCHAR(100)`,
  `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(30) DEFAULT 'info'`,
  `ALTER TABLE audit_cycles ADD COLUMN IF NOT EXISTS department VARCHAR(100)`,
  `ALTER TABLE audit_cycles ADD COLUMN IF NOT EXISTS auditor VARCHAR(150)`,
];

async function syncDatabase() {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    const existingTables = res.rows.map((r) => r.table_name);

    console.log("Existing tables:", existingTables);

    const missing = REQUIRED_TABLES.filter((t) => !existingTables.includes(t));
    if (missing.length > 0) {
      console.log("Missing tables:", missing);
      console.log("Creating missing tables...");
      await client.query(CREATE_TABLES_SQL);
      console.log("All tables created successfully.");
    } else {
      console.log("All required tables already exist.");
    }

    const finalRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log("Final tables:", finalRes.rows.map((r) => r.table_name));

    console.log("Running migrations...");
    for (const sql of MIGRATIONS) {
      try {
        await client.query(sql);
      } catch (err) {
        // Column may already exist, skip
        console.log(`  Migration note: ${err.message.substring(0, 80)}`);
      }
    }
    console.log("Migrations complete.");
  } catch (err) {
    console.error("Error syncing database:", err);
    throw err;
  } finally {
    client.release();
  }
}

export { syncDatabase, REQUIRED_TABLES };
