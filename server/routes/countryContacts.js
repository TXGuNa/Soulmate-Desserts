import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM country_contacts');
    // Map camelCase for frontend
    const mapped = result.rows.map(r => ({
      id: r.id,
      country: r.country_name,
      countryCode: r.country_code,
      email: r.email,
      phone: r.phone,
      isDefault: r.is_default
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

router.post('/', async (req, res) => {
  // Handle both camelCase and snake_case inputs
  const { id, countryCode, country_code, country, country_name, email, phone, isDefault, is_default } = req.body;
  
  // Resolve values
  const code_val = countryCode || country_code;
  const name_val = country || country_name;
  const default_val = isDefault || is_default || false;

  try {
    const result = await query(
      'INSERT INTO country_contacts (id, country_code, country_name, email, phone, is_default) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, code_val, name_val, email, phone, default_val]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // Handle both camelCase and snake_case inputs
  const { countryCode, country_code, country, country_name, email, phone, isDefault, is_default } = req.body;

  // Resolve values
  const code_val = countryCode || country_code;
  const name_val = country || country_name;
  const default_val = isDefault || is_default || false;
  
  try {
    // If setting as default, unset others first
    if (default_val) {
      await query('UPDATE country_contacts SET is_default = false');
    }

    const result = await query(
      'UPDATE country_contacts SET country_code = $1, country_name = $2, email = $3, phone = $4, is_default = $5 WHERE id = $6 RETURNING *',
      [code_val, name_val, email, phone, default_val, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM country_contacts WHERE id = $1', [id]);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

export default router;
