import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM ingredients');
    // Convert stringified decimals to numbers if needed, though frontend handles it
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

router.post('/', async (req, res) => {
  const { id, name, unit, price, pricePerUnit } = req.body;
  try {
    const result = await query(
      'INSERT INTO ingredients (id, name, unit, price, price_per_unit) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, unit, price, pricePerUnit]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

export default router;
