import pool from './config/db.js';

async function makeAdmin() {
  try {
    const roleResult = await pool.query("SELECT id FROM roles WHERE name = 'Admin'");
    if (roleResult.rows.length === 0) {
      console.log("Admin role not found in database.");
      process.exit(1);
    }
    const adminRoleId = roleResult.rows[0].id;
    const email = 'test1784656198301@example.com';
    
    await pool.query("UPDATE users SET role_id = $1 WHERE username = $2", [adminRoleId, email]);
    await pool.query("UPDATE employees SET role_id = $1 WHERE email = $2", [adminRoleId, email]);
    
    console.log("Successfully promoted " + email + " to Admin!");
    process.exit(0);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  }
}

makeAdmin();
