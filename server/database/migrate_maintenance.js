import pool from '../config/db.js';

async function migrate() {
  console.log('Starting maintenance requests migration...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Make sure 'Pending', 'Approved', 'Rejected', 'Technician Assigned' are valid statuses conceptually
    // The status check on the table isn't enforced at DB level except through the DEFAULT in this specific syntax.
    // Wait, the existing table has `status VARCHAR(30) DEFAULT 'Open'`. We want default to be 'Pending'.
    await client.query(`
      ALTER TABLE maintenance_requests 
      ALTER COLUMN status SET DEFAULT 'Pending';
    `);

    const columns = [
      'approved_by INT REFERENCES users(id) ON DELETE SET NULL',
      'approved_at TIMESTAMP',
      'rejected_by INT REFERENCES users(id) ON DELETE SET NULL',
      'rejected_at TIMESTAMP',
      'rejection_reason TEXT',
      'technician_id INT REFERENCES employees(id) ON DELETE SET NULL',
      'assigned_by INT REFERENCES users(id) ON DELETE SET NULL',
      'assigned_at TIMESTAMP',
      'started_at TIMESTAMP',
      'resolution_notes TEXT',
      'updated_at TIMESTAMP',
      'photo_url VARCHAR(255)'
    ];

    for (const col of columns) {
      const colName = col.split(' ')[0];
      try {
        await client.query(`ALTER TABLE maintenance_requests ADD COLUMN ${col}`);
        console.log(`Added column ${colName}`);
      } catch (err) {
        if (err.code === '42701') { // duplicate_column
          console.log(`Column ${colName} already exists, skipping.`);
        } else {
          throw err;
        }
      }
    }

    // Also migrate existing 'Open' statuses to 'Pending' to match new terminology
    await client.query(`
      UPDATE maintenance_requests 
      SET status = 'Pending' 
      WHERE status = 'Open'
    `);
    console.log("Updated existing 'Open' statuses to 'Pending'");

    await client.query('COMMIT');
    console.log('Migration completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
