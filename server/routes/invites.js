const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// GET all invites
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invites ORDER BY created_at DESC');
    const rows = result.rows.map(row => ({
        id: row.id,
        token: row.token,
        email: row.email,
        role: row.role,
        used: row.used,
        expiresAt: row.expires_at
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
});

// CREATE invite
router.post('/', async (req, res) => {
  const { id, token, email, role, used, expiresAt } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO invites (id, token, email, role, used, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, token, email, role, used, expiresAt]
    );
    const row = result.rows[0];
    res.status(201).json({
        id: row.id,
        token: row.token,
        email: row.email,
        role: row.role,
        used: row.used,
        expiresAt: row.expires_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create invite' });
  }
});

// DELETE invite
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM invites WHERE id=$1', [id]);
    res.json({ message: 'Invite deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete invite' });
  }
});

module.exports = router;
