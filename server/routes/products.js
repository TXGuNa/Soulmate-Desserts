const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// GET all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// CREATE product
router.post('/', async (req, res) => {
  const { id, name, description, price, making_price, category_id, images, ingredients, languages, tags } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (id, name, description, price, making_price, category_id, images, ingredients, languages, tags) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [id, name, description, price, making_price, category_id, JSON.stringify(images), JSON.stringify(ingredients), JSON.stringify(languages), JSON.stringify(tags)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, making_price, category_id, images, ingredients, languages, tags } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, making_price=$4, category_id=$5, images=$6, ingredients=$7, languages=$8, tags=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [name, description, price, making_price, category_id, JSON.stringify(images), JSON.stringify(ingredients), JSON.stringify(languages), JSON.stringify(tags), id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
