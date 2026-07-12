-- ==========================================
-- 🏢 MEMBER 1: Auth & Organization Setup
-- ==========================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    department_head INT, -- Will reference employees(id) later, avoiding circular dependency for now
    status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Now we can safely add the foreign key for department_head
ALTER TABLE departments 
ADD CONSTRAINT fk_department_head FOREIGN KEY (department_head) REFERENCES employees(id) ON DELETE SET NULL;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 📦 MEMBER 2: Dashboard + Assets
-- ==========================================

CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    category_id INT REFERENCES asset_categories(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'Available', -- Available, Allocated, Under Maintenance, Retired
    location VARCHAR(100),
    purchase_date DATE,
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_allocations (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    allocated_by INT REFERENCES users(id) ON DELETE SET NULL,
    allocation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_return_date DATE,
    status VARCHAR(30) DEFAULT 'Active'
);

CREATE TABLE asset_transfers (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    from_employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    to_employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    requested_by INT REFERENCES users(id) ON DELETE SET NULL,
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'Pending' -- Pending, Approved, Rejected
);

CREATE TABLE asset_returns (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    processed_by INT REFERENCES users(id) ON DELETE SET NULL,
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    condition VARCHAR(50), -- Good, Damaged, Needs Maintenance
    notes TEXT
);

-- ==========================================
-- 📅 MEMBER 3: Booking + Maintenance
-- ==========================================

CREATE TABLE resource_bookings (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose TEXT,
    status VARCHAR(30) DEFAULT 'Pending', -- Pending, Approved, Rejected, Completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    requester_id INT REFERENCES employees(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High, Critical
    status VARCHAR(30) DEFAULT 'Open', -- Open, In Progress, Resolved
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- ==========================================
-- 📊 MEMBER 4: Audit + Reports
-- ==========================================

CREATE TABLE audit_cycles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    initiated_by INT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'Planned', -- Planned, Active, Completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_items (
    id SERIAL PRIMARY KEY,
    audit_cycle_id INT REFERENCES audit_cycles(id) ON DELETE CASCADE,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'Pending', -- Pending, Verified, Missing, Discrepancy
    scanned_by INT REFERENCES employees(id) ON DELETE SET NULL,
    scanned_at TIMESTAMP,
    discrepancy_notes TEXT
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'DELETE'
    target_table VARCHAR(50) NOT NULL,
    target_id INT NOT NULL,
    details JSONB, -- Storing previous/new state if needed
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
