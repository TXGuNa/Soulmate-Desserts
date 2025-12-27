
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT id, name, email, role, is_approved, created_at FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST/Update user usually handled via Auth. But admin might need to delete.
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Prevent deleting owner? For now allow all.
    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
