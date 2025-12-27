
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET all ingredients
router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM ingredients ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new ingredient
router.post('/', async (req, res) => {
  const { name, unit, price, stock } = req.body;
  try {
    const { rows } = await query(
      'INSERT INTO ingredients (name, unit, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, unit, price, stock || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update ingredient
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, unit, price, stock } = req.body;
  try {
    const { rows } = await query(
      'UPDATE ingredients SET name = $1, unit = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *',
      [name, unit, price, stock, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Ingredient not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ingredient
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM ingredients WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
