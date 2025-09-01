require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

(async () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
    const r = await pool.query('select now()');
    console.log('✅ OK:', r.rows[0]);
    await pool.end();
  } catch (e) {
    console.error('❌ FAIL:', e);
    process.exit(1);
  }
})();
