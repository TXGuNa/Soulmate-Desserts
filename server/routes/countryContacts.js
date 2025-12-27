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

export default router;
