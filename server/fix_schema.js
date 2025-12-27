
import { query } from './db/index.js';
import dotenv from 'dotenv';
dotenv.config();

const fixSchema = async () => {
  try {
    console.log('🔧 Patching Schema...');
    
    // Add missing columns to products table if they don't exist
    await query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS languages TEXT[],
      ADD COLUMN IF NOT EXISTS regions TEXT[];
    `);
    
    console.log('✅ Default languages/regions columns ensured.');

    // Also update existing rows to be null or empty array if needed? 
    // Defaults are fine.
    
    console.log('✨ Schema patch complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Patch failed:', err);
    process.exit(1);
  }
};

fixSchema();
