require('dotenv').config();
const { Pool } = require('pg');

console.log("Current Directory:", process.cwd());
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded (Starts with " + process.env.DATABASE_URL.substring(0, 15) + ")" : "NOT LOADED");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Connection Error:', err.message);
    if (err.code === '28P01') {
        console.error("Suggestion: Password authentication failed. Check .env password.");
    }
  } else {
    console.log('Successfully connected to database!');
    release();
  }
  pool.end();
});
