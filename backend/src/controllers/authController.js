const bcrypt = require('bcrypt');
const db = require('../config/database');
const { generateToken } = require('../utils/jwt');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
  try {
    // Validate input
    await Promise.all(registerValidation.map(v => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, full_name, phone, role } = req.body;

    // Check if user exists
    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    const [user] = await db('users').insert({
      email,
      password_hash: hashed,
      full_name,
      phone,
      role: role || 'viewer',
      wallet_balance: 0,
    }).returning(['id', 'email', 'full_name', 'role', 'wallet_balance', 'stats_times_picked', 'stats_dates_won', 'stats_gas_thrown', 'stats_fines_paid']);

    // Generate JWT
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    await Promise.all(loginValidation.map(v => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });
    delete user.password_hash;

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};
