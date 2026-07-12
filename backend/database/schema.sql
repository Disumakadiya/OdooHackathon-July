-- Placeholder schema for Neon PostgreSQL
CREATE TABLE IF NOT EXISTS health_checks (
  id SERIAL PRIMARY KEY,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
