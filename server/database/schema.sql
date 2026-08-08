-- ============================================================
-- 🏗️ AssetFlow - Complete Database Schema
 -- PostgreSQL 16+ | Neon Serverless
-- ============================================================
-- Auto-generated from sync.js
-- Run: psql $DATABASE_URL -f database/schema.sql
-- ============================================================

-- ==========================================
-- 🏢 MEMBER 1: Auth & Organization Setup
-- ==========================================

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

-- FK for departments.department_head -> employees.id (circular dependency resolved after employees table)
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

-- ==========================================
-- 📦 MEMBER 2: Assets & Lifecycle
-- ==========================================

CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100),
    qr_code VARCHAR(100),
    category_id INT REFERENCES asset_categories(id) ON DELETE SET NULL,
    category VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Available'
        CHECK (status IN ('Available','Allocated','Reserved','Under Maintenance','Lost','Retired','Disposed')),
    department VARCHAR(100),
    location VARCHAR(100),
    assigned_employee VARCHAR(150) DEFAULT 'Unassigned',
    condition VARCHAR(50) DEFAULT 'Good'
        CHECK (condition IN ('Good','Fair','Damaged')),
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
        CHECK (status IN ('Active','Returned'))
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
        CHECK (status IN ('Pending','Approved','Rejected','Completed'))
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

-- ==========================================
-- 📅 MEMBER 3: Bookings & Maintenance
-- ==========================================

CREATE TABLE IF NOT EXISTS resource_bookings (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose TEXT,
    status VARCHAR(30) DEFAULT 'Pending'
        CHECK (status IN ('Pending','Approved','Rejected','Completed','Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    requester_id INT REFERENCES employees(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium'
        CHECK (priority IN ('Low','Medium','High','Critical')),
    status VARCHAR(30) DEFAULT 'Open'
        CHECK (status IN ('Open','In Progress','Resolved','Closed')),
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_approvals (
    id SERIAL PRIMARY KEY,
    maintenance_request_id INT REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    comments TEXT,
    status VARCHAR(30) DEFAULT 'Pending'
        CHECK (status IN ('Pending','Approved','Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- ==========================================
-- 📊 MEMBER 4: Audits & Reports
-- ==========================================

CREATE TABLE IF NOT EXISTS audit_cycles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    auditor VARCHAR(150),
    start_date DATE NOT NULL,
    end_date DATE,
    initiated_by INT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'Planned'
        CHECK (status IN ('Planned','Active','Completed','Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_items (
    id SERIAL PRIMARY KEY,
    audit_cycle_id INT REFERENCES audit_cycles(id) ON DELETE CASCADE,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'Pending'
        CHECK (status IN ('Pending','Verified','Missing','Discrepancy')),
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
    status VARCHAR(30) DEFAULT 'Open'
        CHECK (status IN ('Open','In Review','Resolved','Closed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- ==========================================
-- 🔔 MEMBER 5: Notifications & Activity
-- ==========================================

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info'
        CHECK (type IN ('info','success','warning','critical')),
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

-- ==========================================
-- 📈 Indexes for performance
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_department ON assets(department);
CREATE INDEX IF NOT EXISTS idx_asset_allocations_asset ON asset_allocations(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_transfers_asset ON asset_transfers(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_returns_asset ON asset_returns(asset_id);
CREATE INDEX IF NOT EXISTS idx_resource_bookings_times ON resource_bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_asset ON maintenance_requests(asset_id);
CREATE INDEX IF NOT EXISTS idx_audit_items_cycle ON audit_items(audit_cycle_id);
CREATE INDEX IF NOT EXISTS idx_audit_items_asset ON audit_items(asset_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
