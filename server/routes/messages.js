
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET all messages
router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new message
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const { rows } = await query(
      'INSERT INTO messages (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, message]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
