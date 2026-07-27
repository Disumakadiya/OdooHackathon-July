import pool from './config/db.js';
import bcrypt from 'bcrypt';

async function seedRoles() {
  try {
    const rolesResult = await pool.query("SELECT * FROM roles");
    const roles = rolesResult.rows;
    
    if (roles.length === 0) {
      console.log("No roles found in database.");
      process.exit(1);
    }

    console.log("Creating test users for each role...\n");

    for (let role of roles) {
      const email = `${role.name.toLowerCase().replace(' ', '_')}@example.com`;
      const password = 'Password@123';
      
      // Check if exists
      const userCheck = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);
      if (userCheck.rows.length === 0) {
        // Create employee
        const newEmployee = await pool.query(
          'INSERT INTO employees (name, email, phone, role_id) VALUES ($1, $2, $3, $4) RETURNING id',
          [`Test ${role.name}`, email, '5550000000', role.id]
        );
        const employeeId = newEmployee.rows[0].id;

        // Create user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await pool.query(
          'INSERT INTO users (username, password_hash, employee_id, role_id) VALUES ($1, $2, $3, $4)',
          [email, hashedPassword, employeeId, role.id]
        );
        
        console.log(`Role: ${role.name}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('---------------------------');
      } else {
        console.log(`Role: ${role.name} (Already exists)`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('---------------------------');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seedRoles();
