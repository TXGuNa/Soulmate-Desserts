import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const result = await query("SELECT value FROM settings WHERE key = 'main'");
    if (result.rows.length > 0) {
      // Merge with id: 1 for frontend expectation
      res.json({ id: 1, ...result.rows[0].value });
    } else {
      res.status(404).json({ error: 'Settings not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/:id', async (req, res) => {
  const settings = req.body;
  // Remove id from storage payload to keep it clean, though not strictly necessary
  const { id, ...data } = settings; 
  
  try {
    const result = await query(
      "INSERT INTO settings (key, value) VALUES ('main', $1) ON CONFLICT (key) DO UPDATE SET value = $1 RETURNING *",
      [data]
    );
    res.json({ id: 1, ...result.rows[0].value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
