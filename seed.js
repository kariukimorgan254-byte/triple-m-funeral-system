import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  console.log('Creating users table in PostgreSQL...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'client',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const hash = await bcrypt.hash('AdminPassword@123', 12);
  await pool.query(`
    INSERT INTO users (first_name, last_name, email, password_hash, role)
    VALUES ('Super', 'Admin', 'admin@example.com', $1, 'admin')
    ON CONFLICT (email) DO NOTHING;
  `, [hash]);

  console.log('✅ Success! Users table and admin user created in live database.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed Error:', err);
  process.exit(1);
});
