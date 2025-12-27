
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db/index.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import messagesRoutes from './routes/messages.js';
import ordersRoutes from './routes/orders.js';
import ingredientsRoutes from './routes/ingredients.js';
import invitesRoutes from './routes/invites.js';
import usersRoutes from './routes/users.js';
import settingsRoutes from './routes/settings.js';
import countryContactsRoutes from './routes/countryContacts.js';

dotenv.config();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/messages', messagesRoutes);
app.use('/orders', ordersRoutes);
app.use('/ingredients', ingredientsRoutes);
app.use('/invites', invitesRoutes);
app.use('/users', usersRoutes);
app.use('/settings', settingsRoutes);
app.use('/countryContacts', countryContactsRoutes);

// Generic GET users (keep for now until users route is proper)
/* 
app.get('/users', async (req, res) => {
  try {
     const { rows } = await query('SELECT * FROM users');
     res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
*/

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
