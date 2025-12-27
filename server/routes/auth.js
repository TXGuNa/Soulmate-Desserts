
import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

const OWNER_EMAIL = 'txguna@gmail.com';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check User
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'User not found' });

    const user = rows[0];

    // 2. Check Password (Mock plain text)
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // 3. Owner Approval Check
    if (email === OWNER_EMAIL && !user.is_approved) {
      console.log('--- OWNER APPROVAL EMAIL SIMULATION ---');
      console.log(`To: ${OWNER_EMAIL}`);
      console.log(`Subject: Approve Owner Login`);
      console.log(`Link: http://localhost:3002/auth/approve-owner?secret=TX_SECRET_2025`);
      console.log('---------------------------------------');
      
      return res.json({ 
        success: false, 
        status: 'pending_approval', 
        message: 'Approval email sent. Please verify to continue.' 
      });
    }

    // 4. Success
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/approve-owner', async (req, res) => {
  const { secret } = req.query;
  if (secret !== 'TX_SECRET_2025') return res.status(403).send("Invalid secret");

  try {
    await query('UPDATE users SET is_approved = TRUE WHERE email = $1', [OWNER_EMAIL]);
    res.send("<h1>Owner Approved!</h1><p>You can now go back to the app and login.</p>");
  } catch (err) {
    res.status(500).send("Error approving owner");
  }
});

export default router;
