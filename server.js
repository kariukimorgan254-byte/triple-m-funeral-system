import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'triple-m-secret-key';

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Auto-Initialize All PostgreSQL Tables & Seed Default Data
async function initDatabase() {
  try {
    // 1. Users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Inventory / Caskets
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id VARCHAR(100) PRIMARY KEY,
        sku VARCHAR(50) NOT NULL,
        name VARCHAR(150) NOT NULL,
        material VARCHAR(50) NOT NULL,
        size VARCHAR(50) DEFAULT 'STANDARD',
        retail_price NUMERIC(12,2) NOT NULL,
        current_stock INT DEFAULT 3,
        is_low_stock BOOLEAN DEFAULT FALSE,
        image_url TEXT
      );
    `);

    // 3. Hearses Fleet
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hearses (
        id VARCHAR(100) PRIMARY KEY,
        vehicle_name VARCHAR(150) NOT NULL,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        license_plate VARCHAR(30) UNIQUE NOT NULL,
        status VARCHAR(30) DEFAULT 'AVAILABLE',
        current_mileage INT DEFAULT 10000,
        image_url TEXT
      );
    `);

    // 4. Bookings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(100) PRIMARY KEY,
        booking_number VARCHAR(50) NOT NULL,
        client_name VARCHAR(150) NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        burial_date VARCHAR(50),
        casket_name VARCHAR(150),
        hearse_name VARCHAR(150),
        total_quote NUMERIC(12,2) DEFAULT 0,
        amount_paid NUMERIC(12,2) DEFAULT 0,
        status VARCHAR(30) DEFAULT 'PENDING',
        transport JSONB
      );
    `);

    // 5. M-Pesa Receipts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id VARCHAR(100) PRIMARY KEY,
        amount NUMERIC(12,2) NOT NULL,
        reference_number VARCHAR(100) UNIQUE NOT NULL,
        date VARCHAR(50) NOT NULL,
        status VARCHAR(30) DEFAULT 'PENDING_APPROVAL',
        note TEXT
      );
    `);

    // Seed Initial Caskets if empty
    const casketsCheck = await pool.query('SELECT COUNT(*)::int FROM inventory');
    if (casketsCheck.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO inventory (id, sku, name, material, size, retail_price, current_stock, is_low_stock) VALUES
        ('csk-1', 'CK-MHG-01', 'Royal Mahogany Executive Casket', 'SOLID_WOOD', 'STANDARD', 125000, 4, false),
        ('csk-2', 'CK-OAK-02', 'Imperial Oak Presidential Dome', 'SOLID_WOOD', 'OVERSIZED', 185000, 1, true),
        ('csk-3', 'CK-PIN-03', 'Classic Eco-Pine Vault Casket', 'VENEER', 'STANDARD', 45000, 8, false),
        ('csk-4', 'CK-STL-04', 'Milano Brushed Steel Vault', 'METAL_STEEL', 'STANDARD', 150000, 2, true);
      `);
    }

    // Seed Initial Hearses if empty
    const hearsesCheck = await pool.query('SELECT COUNT(*)::int FROM hearses');
    if (hearsesCheck.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO hearses (id, vehicle_name, make, model, year, license_plate, status, current_mileage) VALUES
        ('hrs-1', 'Silver Grace Mercedes Funeral Coach', 'Mercedes-Benz', 'Sprinter Special', 2020, 'KBY 104M', 'AVAILABLE', 42000),
        ('hrs-2', 'Eternal Peace Limousine Coach', 'Volvo', 'V90 Specialist', 2022, 'KDD 882X', 'DISPATCHED', 18500),
        ('hrs-3', 'Golden Gate Heavy-Duty 4x4 Hearse', 'Toyota', 'Land Cruiser 4WD', 2018, 'KBQ 550A', 'AVAILABLE', 89000);
      `);
    }

    // Seed Initial Bookings if empty
    const bookingsCheck = await pool.query('SELECT COUNT(*)::int FROM bookings');
    if (bookingsCheck.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO bookings (id, booking_number, client_name, contact_phone, burial_date, casket_name, hearse_name, total_quote, amount_paid, status) VALUES
        ('bk-1', 'BK-24-9982', 'Wanjiku Kamau & Family', '+254 722 000 111', '2026-10-05', 'Royal Mahogany Executive Casket', 'Silver Grace Mercedes Funeral Coach', 185000, 50000, 'CONFIRMED');
      `);
    }

    // Seed Initial Receipts if empty
    const receiptsCheck = await pool.query('SELECT COUNT(*)::int FROM receipts');
    if (receiptsCheck.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO receipts (id, amount, reference_number, date, status, note) VALUES
        ('rcp-1', 50000, 'RKT992810X', '2026-09-20', 'PENDING_APPROVAL', 'Deposit for BK-24-9982');
      `);
    }

    console.log('✅ PostgreSQL database and seed tables successfully initialized.');
  } catch (err) {
    console.error('Error initializing PostgreSQL tables:', err);
  }
}
initDatabase();

// --- REST API ENDPOINTS ---

// 1. Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: 'connected' }));

// 2. Auth Login
app.post(['/api/login', '/api/login.php'], async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email.trim()]);
    const user = rows[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({
        success: true,
        token,
        user: { id: String(user.id), email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role }
      });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// 3. Current User
app.get(['/api/me', '/api/me.php'], async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query('SELECT id, email, first_name, last_name, role FROM users WHERE id = $1', [decoded.id]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { id: String(user.id), email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 4. Inventory (Caskets) API
app.get('/api/inventory', async (req, res) => {
  const { rows } = await pool.query('SELECT id, sku, name, material, size, retail_price AS "retailPrice", current_stock AS "currentStock", is_low_stock AS "isLowStock", image_url AS "imageUrl" FROM inventory ORDER BY name ASC');
  res.json(rows);
});

app.post('/api/inventory', async (req, res) => {
  const { id, sku, name, material, size, retailPrice, currentStock, isLowStock, imageUrl } = req.body;
  await pool.query(
    'INSERT INTO inventory (id, sku, name, material, size, retail_price, current_stock, is_low_stock, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO UPDATE SET current_stock = EXCLUDED.current_stock, is_low_stock = EXCLUDED.is_low_stock, image_url = COALESCE(EXCLUDED.image_url, inventory.image_url)',
    [id, sku, name, material, size || 'STANDARD', retailPrice, currentStock, isLowStock, imageUrl]
  );
  res.json({ success: true });
});

app.delete('/api/inventory/:id', async (req, res) => {
  await pool.query('DELETE FROM inventory WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// 5. Hearses Fleet API
app.get('/api/hearses', async (req, res) => {
  const { rows } = await pool.query('SELECT id, vehicle_name AS "vehicleName", make, model, year, license_plate AS "licensePlate", status, current_mileage AS "currentMileage", image_url AS "imageUrl" FROM hearses ORDER BY vehicle_name ASC');
  res.json(rows);
});

app.post('/api/hearses', async (req, res) => {
  const { id, vehicleName, make, model, year, licensePlate, status, currentMileage, imageUrl } = req.body;
  await pool.query(
    'INSERT INTO hearses (id, vehicle_name, make, model, year, license_plate, status, current_mileage, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, image_url = COALESCE(EXCLUDED.image_url, hearses.image_url)',
    [id, vehicleName, make, model, year, licensePlate, status, currentMileage, imageUrl]
  );
  res.json({ success: true });
});

app.delete('/api/hearses/:id', async (req, res) => {
  await pool.query('DELETE FROM hearses WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// 6. Bookings API
app.get('/api/bookings', async (req, res) => {
  const { rows } = await pool.query('SELECT id, booking_number AS "bookingNumber", client_name AS "clientName", contact_phone AS "contactPhone", burial_date AS "burialDate", casket_name AS "casketName", hearse_name AS "hearseName", total_quote AS "totalQuote", amount_paid AS "amountPaid", status, transport FROM bookings ORDER BY id DESC');
  res.json(rows);
});

// 7. Receipts API
app.get('/api/receipts', async (req, res) => {
  const { rows } = await pool.query('SELECT id, amount, reference_number AS "referenceNumber", date, status, note FROM receipts ORDER BY id DESC');
  res.json(rows);
});

app.put('/api/receipts/:id', async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE receipts SET status = $1 WHERE id = $2', [status, req.params.id]);
  res.json({ success: true });
});

// Serve Static Frontend
const possibleDistPaths = [
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'frontend', 'dist'),
  path.join(__dirname, 'client', 'dist'),
  path.join(__dirname, '..', 'frontend', 'dist')
];

let staticDistPath = possibleDistPaths.find(p => fs.existsSync(p));

if (staticDistPath) {
  app.use(express.static(staticDistPath));
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
    }
    res.sendFile(path.join(staticDistPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ error: 'Frontend build not found.' });
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
