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

app.use(cors());
app.use(express.json());

// Database Connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role }
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/me', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query('SELECT id, email, first_name, last_name, role FROM users WHERE id = $1', [decoded.id]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Auto-locate frontend dist folder
const possibleDistPaths = [
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'frontend', 'dist'),
  path.join(__dirname, 'client', 'dist'),
  path.join(__dirname, '..', 'frontend', 'dist')
];

let staticDistPath = possibleDistPaths.find(p => fs.existsSync(p));

if (staticDistPath) {
  console.log(`Serving static frontend from: ${staticDistPath}`);
  app.use(express.static(staticDistPath));
  
  // Express 5 compatible catch-all
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
    }
    res.sendFile(path.join(staticDistPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ error: `Frontend dist folder not found.` });
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
