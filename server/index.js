import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRoutes from './routes/products.js';
import ingredientsRoutes from './routes/ingredients.js';
import settingsRoutes from './routes/settings.js';
import countryContactsRoutes from './routes/countryContacts.js';
import usersRoutes from './routes/users.js';
import ordersRoutes from './routes/orders.js';
import messagesRoutes from './routes/messages.js';
import invitesRoutes from './routes/invites.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/products', productsRoutes);
app.use('/ingredients', ingredientsRoutes);
app.use('/settings', settingsRoutes);
app.use('/countryContacts', countryContactsRoutes);
app.use('/users', usersRoutes);
app.use('/orders', ordersRoutes);
app.use('/messages', messagesRoutes);
app.use('/invites', invitesRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Soulmate Desserts API Running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
