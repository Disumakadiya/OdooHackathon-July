import bcrypt from 'bcrypt';
import pool from './config/db.js';

async function seedDemoUsers() {
  try {
    console.log('Seeding demo users for each role...');

    const demoUsers = [
      { name: 'Alice Admin', email: 'admin@demo.com', roleName: 'Admin' },
      { name: 'Bob Manager', email: 'manager@demo.com', roleName: 'Asset Manager' },
      { name: 'Charlie Head', email: 'head@demo.com', roleName: 'Department Head' },
      { name: 'Dave Employee', email: 'employee@demo.com', roleName: 'Employee' }
    ];

    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    for (const user of demoUsers) {
      // 1. Get role ID
      const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [user.roleName]);
      if (roleResult.rows.length === 0) {
        console.log(`Skipping ${user.email}, role ${user.roleName} not found.`);
        continue;
      }
      const roleId = roleResult.rows[0].id;

      // Check if user already exists
      const checkUser = await pool.query('SELECT * FROM users WHERE username = $1', [user.email]);
      if (checkUser.rows.length > 0) {
        // Just update their role
        await pool.query('UPDATE users SET role_id = $1 WHERE username = $2', [roleId, user.email]);
        await pool.query('UPDATE employees SET role_id = $1 WHERE email = $2', [roleId, user.email]);
        console.log(`Updated existing user ${user.email} to ${user.roleName}`);
        continue;
      }

      // 2. Create Employee
      const empRes = await pool.query(
        'INSERT INTO employees (name, email, role_id) VALUES ($1, $2, $3) RETURNING id',
        [user.name, user.email, roleId]
      );
      const empId = empRes.rows[0].id;

      // 3. Create User
      await pool.query(
        'INSERT INTO users (username, password_hash, employee_id, role_id) VALUES ($1, $2, $3, $4)',
        [user.email, hashedPassword, empId, roleId]
      );
      console.log(`Created ${user.email} as ${user.roleName}`);
    }

    console.log('\n✅ Demo users seeded successfully!');
    console.log('You can now log in with:');
    console.log('- admin@demo.com / password123');
    console.log('- manager@demo.com / password123');
    console.log('- head@demo.com / password123');
    console.log('- employee@demo.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  }
}

seedDemoUsers();
