
import { query } from '../server/db/index.js';

async function migrate() {
  try {
    console.log('Adding discount column to users table...');
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0;
    `);
    console.log('Migration successful: discount column added.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
