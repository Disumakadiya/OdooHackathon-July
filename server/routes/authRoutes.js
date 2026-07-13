import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_hackathon';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Get Employee role ID for default signup
    const roleResult = await pool.query("SELECT id FROM roles WHERE name = 'Employee'");
    const roleId = roleResult.rows.length > 0 ? roleResult.rows[0].id : null;

    // Check if user exists (using users and employees table logic, but keeping it simple for now)
    const userCheck = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 1. Create employee
    const newEmployee = await pool.query(
      'INSERT INTO employees (name, email, phone, role_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [name || 'New Employee', email, phone || null, roleId]
    );
    const employeeId = newEmployee.rows[0].id;

    // 2. Create user with hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (username, password_hash, employee_id, role_id) VALUES ($1, $2, $3, $4) RETURNING id, username, employee_id',
      [email, hashedPassword, employeeId, roleId]
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: newUser.rows[0].id, email: newUser.rows[0].username } 
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userCheck = await pool.query(`
      SELECT u.*, e.name as employee_name, e.email as employee_email, r.name as role_name 
      FROM users u 
      LEFT JOIN employees e ON u.employee_id = e.id 
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.username = $1
    `, [email]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userCheck.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        employee_id: user.employee_id,
        name: user.employee_name,
        email: user.employee_email,
        role: user.role_name || 'Employee'
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, message: 'Logged in successfully' });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
