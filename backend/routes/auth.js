const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /auth/login
// body: { email, password }  OR { username, password }
// Accept either email or username for login (minimal change: we reuse the same request body)
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const identifier = email; // frontend sends value in `email` field (could be email or username)

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Missing identifier or password' });
    }

    // Try to find user by email OR username (allow login by either)
    const rows = await db.query('SELECT id, username, email, faculty, password FROM user WHERE email = ? OR username = ? LIMIT 1', [identifier, identifier]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user info without password
    const { password: _pw, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error('Error in /auth/login', err.message);
    next(err);
  }
});

// POST /auth/register
// body: { username, email, faculty, password }
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, faculty, password } = req.body || {};
    if (!username || !email || !faculty || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // check if email already exists
    const existing = await db.query('SELECT id FROM user WHERE email = ? LIMIT 1', [email]);
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Note: passwords are stored in plaintext in this project for now.
    // For production, hash passwords with bcrypt before storing.
    const result = await db.query('INSERT INTO user (username, email, faculty, password) VALUES (?, ?, ?, ?)', [username, email, faculty, password]);

    // result.insertId contains the new user id
    const newUserRows = await db.query('SELECT id, username, email, faculty FROM user WHERE id = ? LIMIT 1', [result.insertId]);
    const newUser = newUserRows[0];
    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error('Error in /auth/register', err.message);
    next(err);
  }
});

module.exports = router;
