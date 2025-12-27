import pg from 'pg';

const configs = [
  'postgresql://postgres:%40Texas2026.%2C@localhost:5432/postgres'
];

async function test() {
  for (const url of configs) {
    console.log(`Trying formatted URL`);
    const pool = new pg.Pool({ connectionString: url, connectionTimeoutMillis: 2000 });
    try {
      const client = await pool.connect();
      console.log('SUCCESS with password:', config.password);
      client.release();
      await pool.end();
      return; 
    } catch (e) {
      console.log('Failed:', e.message);
    }
    await pool.end();
  }
}

test();

