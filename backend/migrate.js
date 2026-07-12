import pool from './config/db.js';

async function migrate() {
  try {
    console.log('Running migrations...');
    
    // 1. Add phone column
    await pool.query('ALTER TABLE employees ADD COLUMN IF NOT EXISTS phone VARCHAR(20);');
    console.log('Added phone column to employees table.');

    // 2. Seed roles
    const roles = ['Admin', 'Asset Manager', 'Department Head', 'Employee'];
    for (const role of roles) {
      await pool.query(
        'INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [role, `${role} role`]
      );
    }
    console.log('Seeded roles.');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
