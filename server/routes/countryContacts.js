
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM country_contacts ORDER BY country_name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { country_code, country_name, email, phone, message, is_default } = req.body;
  try {
    const { rows } = await query(
      'INSERT INTO country_contacts (country_code, country_name, email, phone, message, is_default) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [country_code, country_name, email, phone, message, is_default || false]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { country_code, country_name, email, phone, message, is_default } = req.body;
  try {
    const { rows } = await query(
      'UPDATE country_contacts SET country_code = $1, country_name = $2, email = $3, phone = $4, message = $5, is_default = $6 WHERE id = $7 RETURNING *',
      [country_code, country_name, email, phone, message, is_default, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Contact not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM country_contacts WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
