const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  const { id, email, password, name, role, phone } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (id, email, password, name, role, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, email, password, name, role, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
