const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// GET all messages
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// CREATE message
router.post('/', async (req, res) => {
  const { id, name, email, phone, message } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO messages (id, name, email, phone, message, date) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [id, name, email, phone, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM messages WHERE id=$1', [id]);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
