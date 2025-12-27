
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// GET all settings or specific ID (frontend asks for /settings/1, but we might just return specific configs)
// To match "settings/1" style from client.js, we assume id=1 is the main config row if we were using a single row.
// But my schema uses key-value. Let's adapt.
// If client requests /settings/1, it expects an object with id=1 and all settings.
// I will just return a merged object of all settings for GET /settings/1 to satisfy the client structure.

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM settings');
    // Transform rows [{key: 'general', value: {...}}, {key: 'currency', value: [...]}] into one big object
    // Client expects { id: 1, ...properties }
    
    // Default structure if empty
    let merged = { id: 1 };
    
    rows.forEach(row => {
        // If value is an object, spread it. If generic value, use key.
        if (typeof row.value === 'object' && !Array.isArray(row.value)) {
            merged = { ...merged, ...row.value };
        } else {
            merged[row.key] = row.value;
        }
    });

    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT settings
// Client sends { id: 1, shippingCost: ..., currencies: ... }
router.put('/:id', async (req, res) => {
  const body = req.body;
  
  try {
    // We update our key-value store.
    // For simplicity, we can just save the whole body as 'main' key or split it.
    // Let's just save everything into a 'main' key for now to adhere to the simple "document" style the frontend expects from JSON-server/Firebase.
    
    await query(
      `INSERT INTO settings (key, value) VALUES ('main', $1) 
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [JSON.stringify(body)]
    );
    
    res.json(body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// If client calls GET /settings (without ID), handle that too
router.get('/', async (req, res) => {
    try {
        const { rows } = await query("SELECT value FROM settings WHERE key = 'main'");
        if (rows.length > 0) {
            res.json(rows[0].value);
        } else {
            res.json({});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
