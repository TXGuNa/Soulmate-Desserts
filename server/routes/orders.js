import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', async (req, res) => {
  const { user_id, items, total, status, shipping_address } = req.body;
  const id = Date.now().toString(); // Simple ID generation
  try {
    const result = await query(
      'INSERT INTO orders (id, user_id, items, total, status, shipping_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, user_id, JSON.stringify(items), total, status || 'pending', JSON.stringify(shipping_address)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
