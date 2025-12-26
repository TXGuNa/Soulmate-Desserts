const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// GET all ingredients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingredients ORDER BY created_at DESC');
    const rows = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      unit: row.unit,
      price: parseFloat(row.price),
      pricePerUnit: parseFloat(row.price_per_unit),
      stock: parseFloat(row.stock) || 0,
      createdAt: row.created_at
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// CREATE ingredient
router.post('/', async (req, res) => {
  const { id, name, unit, price, pricePerUnit, stock } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ingredients (id, name, unit, price, price_per_unit, stock) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, name, unit, price, pricePerUnit, stock || 0]
    );
     // Map back to camelCase
    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      name: row.name,
      unit: row.unit,
      price: parseFloat(row.price),
      pricePerUnit: parseFloat(row.price_per_unit),
      stock: parseFloat(row.stock)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

// UPDATE ingredient
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, unit, price, pricePerUnit, stock } = req.body;
  try {
    await pool.query(
      `UPDATE ingredients SET name=$1, unit=$2, price=$3, price_per_unit=$4, stock=$5 WHERE id=$6`,
      [name, unit, price, pricePerUnit, stock, id]
    );
    res.json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

// DELETE ingredient
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM ingredients WHERE id=$1', [id]);
    res.json({ message: 'Ingredient deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

module.exports = router;
