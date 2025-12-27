
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET all invites
router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM invites');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new invite
router.post('/', async (req, res) => {
  const { token, role, expires_at } = req.body;
  try {
    const { rows } = await query(
      'INSERT INTO invites (token, role, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [token, role, expires_at]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE invite
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM invites WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
