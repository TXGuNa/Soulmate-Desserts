import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    // We need to construct the full product object including ingredients
    const productsResult = await query('SELECT * FROM products ORDER BY id ASC');
    const products = productsResult.rows;

    const productsWithIngredients = await Promise.all(products.map(async (p) => {
      const ingResult = await query('SELECT ingredient_id as id, quantity FROM products_ingredients WHERE product_id = $1', [p.id]);
      return { ...p, ingredients: ingResult.rows };
    }));

    res.json(productsWithIngredients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, making_price, category_id, images, tags, languages, regions, ingredients } = req.body;
  console.log('Update Product params:', { id, name, price, tags }); // Debug Log

  try {
    // Single Hero Logic
    if (tags && tags.includes('hero')) {
      await query("UPDATE products SET tags = array_remove(tags, 'hero') WHERE 'hero' = ANY(tags) AND id != $1", [id]);
    }

    const updateQuery = `
      UPDATE products 
      SET name = $1, description = $2, price = $3, making_price = $4, category_id = $5, images = $6, tags = $7, languages = $8, regions = $9
      WHERE id = $10
      RETURNING *
    `;
    const result = await query(updateQuery, [name, description, price, making_price, category_id, images, tags, languages, regions, id]);
    
    // Update ingredients
    if (ingredients) {
      await query('DELETE FROM products_ingredients WHERE product_id = $1', [id]);
      for (const ing of ingredients) {
        await query('INSERT INTO products_ingredients (product_id, ingredient_id, quantity) VALUES ($1, $2, $3)', [id, ing.id, ing.quantity]);
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  const { name, description, price, making_price, category_id, images, tags, languages, regions, ingredients } = req.body;
  try {
    // Single Hero Logic
    if (tags && tags.includes('hero')) {
      await query("UPDATE products SET tags = array_remove(tags, 'hero') WHERE 'hero' = ANY(tags)");
    }

    const insertQuery = `
      INSERT INTO products (name, description, price, making_price, category_id, images, tags, languages, regions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await query(insertQuery, [name, description, price, making_price, category_id, images, tags, languages, regions]);
    const newProduct = result.rows[0];

    if (ingredients) {
      for (const ing of ingredients) {
        await query('INSERT INTO products_ingredients (product_id, ingredient_id, quantity) VALUES ($1, $2, $3)', [newProduct.id, ing.id, ing.quantity]);
      }
    }

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
