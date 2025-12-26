const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// GET all country contacts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM country_contacts');
    const rows = result.rows.map(row => ({
        id: row.id,
        country: row.country,
        countryCode: row.country_code,
        email: row.email,
        phone: row.phone,
        isDefault: row.is_default
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch country contacts' });
  }
});

// CREATE country contact
router.post('/', async (req, res) => {
  const { id, country, countryCode, email, phone, isDefault } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO country_contacts (id, country, country_code, email, phone, is_default) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, country, countryCode, email, phone, isDefault]
    );
    const row = result.rows[0];
    res.status(201).json({
        id: row.id,
        country: row.country,
        countryCode: row.country_code,
        email: row.email,
        phone: row.phone,
        isDefault: row.is_default
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create country contact' });
  }
});

// UPDATE country contact
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { country, countryCode, email, phone, isDefault } = req.body;
  try {
    // If setting default, unset other defaults?? (Optional, but good practice)
    if (isDefault) {
        // Not strictly required by JSON server behavior but safer
    }

    await pool.query(
      `UPDATE country_contacts SET country=$1, country_code=$2, email=$3, phone=$4, is_default=$5 WHERE id=$6`,
      [country, countryCode, email, phone, isDefault, id]
    );
    res.json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update country contact' });
  }
});

// DELETE country contact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM country_contacts WHERE id=$1', [id]);
    res.json({ message: 'Country contact deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete country contact' });
  }
});

module.exports = router;
