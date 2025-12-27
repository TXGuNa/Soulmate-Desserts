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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, unit, price } = req.body;
  
  try {
    const result = await query(
      'UPDATE ingredients SET name = $1, unit = $2, price = $3 WHERE id = $4 RETURNING *',
      [name, unit, price, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating ingredient:', err);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM ingredients WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (err) {
    console.error('Error deleting ingredient:', err);
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

export default router;
