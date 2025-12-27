
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL from env, or default to local
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/soulmate_desserts',
});

export const query = (text, params) => pool.query(text, params);
export default pool;
