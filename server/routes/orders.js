
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders ORDER BY created_at DESC');
    // Ensure items and shipping_address are parsed if PG doesn't auto-parse JSONB (node-pg usually does)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new order
router.post('/', async (req, res) => {
  const { id, user_id, items, total, shipping_address } = req.body;
  try {
    const { rows } = await query(
      'INSERT INTO orders (id, user_id, items, total, shipping_address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, user_id || null, JSON.stringify(items), total, JSON.stringify(shipping_address)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update order status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { rows } = await query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
