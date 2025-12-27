import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // exposing password for client-side auth compatibility
    const result = await query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { discount, role } = req.body;
  
  try {
    // Only update fields that are provided
    if (discount !== undefined) {
      await query('UPDATE users SET discount = $1 WHERE id = $2', [discount, id]);
    }
    
    if (role !== undefined) {
       // Prevent changing Owner role
       const userCheck = await query('SELECT role FROM users WHERE id = $1', [id]);
       if (userCheck.rows[0]?.role === 'owner' && role !== 'owner') {
         return res.status(403).json({ error: 'Cannot change Owner role' });
       }
       await query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    }

    const updated = await query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user is owner before deleting
    const userResult = await query('SELECT role FROM users WHERE id = $1', [id]);
    if (userResult.rows.length > 0 && userResult.rows[0].role === 'owner') {
      return res.status(403).json({ error: 'Cannot delete the Owner' });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
