require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', require('./routes/products'));
app.use('/settings', require('./routes/settings'));
app.use('/orders', require('./routes/orders'));
app.use('/ingredients', require('./routes/ingredients'));
app.use('/users', require('./routes/users'));
app.use('/messages', require('./routes/messages'));
app.use('/invites', require('./routes/invites'));
app.use('/countryContacts', require('./routes/countryContacts'));

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test DB Connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to PostgreSQL Database');
    release();
  }
});

// Basic Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Soulmate Desserts API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export pool for use in routes
module.exports = { app, pool };
