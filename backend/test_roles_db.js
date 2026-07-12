import pool from './config/db.js';

async function verifyRoles() {
  try {
    console.log('--- 1. Checking Database Storage ---');
    const dbUsers = await pool.query(`
      SELECT e.email, e.name, r.name as role 
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      WHERE e.email IN ('admin@demo.com', 'manager@demo.com', 'head@demo.com', 'employee@demo.com')
    `);
    
    console.table(dbUsers.rows);

    console.log('\n--- 2. Simulating Logins and Checking JWT Payload ---');
    const emails = ['admin@demo.com', 'manager@demo.com', 'head@demo.com', 'employee@demo.com'];
    
    for (const email of emails) {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Decode JWT payload without verifying signature just to read the payload
        const base64Url = data.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        console.log(`✅ Login Success: ${email} -> Assigned Role in JWT: [${payload.user.role}]`);
      } else {
        console.log(`❌ Login Failed for ${email}: ${data.message}`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

verifyRoles();
