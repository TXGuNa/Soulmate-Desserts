
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE product
router.post('/', async (req, res) => {
  const { name, description, price, making_price, category_id, images, tags, ingredients, languages, regions } = req.body;
  try {
    // 1. Insert Product
    const { rows } = await query(
      `INSERT INTO products 
      (name, description, price, making_price, category_id, images, tags, languages, regions) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [name, description, price, making_price, category_id || null, images || [], tags || [], languages || [], regions || []]
    );
    const newProduct = rows[0];

    // 2. Insert Ingredients relations
    if (ingredients && ingredients.length > 0) {
      for (const ing of ingredients) {
        await query(
          'INSERT INTO products_ingredients (product_id, ingredient_id, quantity) VALUES ($1, $2, $3)',
          [newProduct.id, ing.id, ing.quantity]
        );
      }
    }

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, making_price, category_id, images, tags, ingredients, languages, regions } = req.body;
  
  try {
    // 1. Update Product details
    const { rows } = await query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, making_price = $4, category_id = $5, images = $6, tags = $7, languages = $8, regions = $9
       WHERE id = $10 
       RETURNING *`,
      [name, description, price, making_price, category_id || null, images, tags, languages, regions, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const updatedProduct = rows[0];

    // 2. Update Ingredients (Delete all and re-insert for simplicity)
    await query('DELETE FROM products_ingredients WHERE product_id = $1', [id]);
    
    if (ingredients && ingredients.length > 0) {
      for (const ing of ingredients) {
        await query(
          'INSERT INTO products_ingredients (product_id, ingredient_id, quantity) VALUES ($1, $2, $3)',
          [id, ing.id, ing.quantity]
        );
      }
    }
    
    // Fetch full object with ingredients might be needed, but frontend usually handles it.
    // For now returning the updated product row.
    res.json(updatedProduct);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
