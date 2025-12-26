const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    // Map snake_case or specific column names to frontend expectations if needed
    // Frontend expects: id, status, total, customerName, items...
    // Our DB has customer_name. We need to alias or map.
    
    const mappedOrders = result.rows.map(row => ({
        id: row.id,
        status: row.status,
        total: parseFloat(row.total),
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        items: row.items,
        deliveryDate: row.delivery_date,
        address: row.address,
        notes: row.notes,
        createdAt: row.created_at
    }));

    res.json(mappedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// CREATE order
router.post('/', async (req, res) => {
  const { id, status, total, customerName, customerEmail, customerPhone, items, deliveryDate, address, notes, createdAt } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO orders (id, status, total, customer_name, customer_email, customer_phone, items, delivery_date, address, notes, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [id, status, total, customerName, customerEmail, customerPhone, JSON.stringify(items), deliveryDate, address, notes, createdAt || new Date()]
    );
     // Map back to camelCase for response
     const row = result.rows[0];
     const createdOrder = {
        id: row.id,
        status: row.status,
        total: row.total,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        items: row.items,
        deliveryDate: row.delivery_date,
        address: row.address,
        notes: row.notes,
        createdAt: row.created_at
     };
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// UPDATE order
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, total, customerName, customerEmail, customerPhone, items, deliveryDate, address, notes } = req.body;
  
  try {
    // Only update fields that are present
    await pool.query(
      `UPDATE orders SET status=$1, total=$2, customer_name=$3, customer_email=$4, customer_phone=$5, items=$6, delivery_date=$7, address=$8, notes=$9 
       WHERE id=$10`,
      [status, total, customerName, customerEmail, customerPhone, JSON.stringify(items), deliveryDate, address, notes, id]
    );
    res.json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
