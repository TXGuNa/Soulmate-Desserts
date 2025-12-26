require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema creation...');
    await pool.query(schemaSql);
    console.log('Schema created successfully!');
  } catch (err) {
    console.error('Error creating schema:', err);
  } finally {
    await pool.end();
  }
}

setupDatabase();
