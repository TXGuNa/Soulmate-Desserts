const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// GET settings (always ID 1)
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings WHERE id=$1', [1]);
    if (result.rows.length === 0) {
      // Return default if not initialized
      return res.json({}); 
    }
    // Postgres returns snake_case columns if not aliased, but we store JSON in 'currencies', 'contact_info' etc.
    // The frontend expects camelCase for some fields inside the JSON strings.
    // Since we used JSONB columns, they are returned as objects.
    const row = result.rows[0];
    
    // Map back to frontend structure if necessary, or just return row if structure matches
    const settings = {
        id: row.id,
        language: row.language,
        currency: row.currency,
        currencies: row.currencies || [],
        contactInfo: row.contact_info || {},
        store: row.store || {}
    };
    
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// UPDATE settings
router.put('/:id', async (req, res) => {
  const { language, currency, currencies, contactInfo, store } = req.body;
  try {
    // Upsert logic
    const Check = await pool.query('SELECT id FROM settings WHERE id=1');
    if (Check.rows.length === 0) {
        await pool.query(
            `INSERT INTO settings (id, language, currency, currencies, contact_info, store) VALUES (1, $1, $2, $3, $4, $5)`,
            [language, currency, JSON.stringify(currencies), JSON.stringify(contactInfo), JSON.stringify(store)]
        );
    } else {
        await pool.query(
            `UPDATE settings SET language=$1, currency=$2, currencies=$3, contact_info=$4, store=$5 WHERE id=1`,
            [language, currency, JSON.stringify(currencies), JSON.stringify(contactInfo), JSON.stringify(store)]
        );
    }
    res.json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
