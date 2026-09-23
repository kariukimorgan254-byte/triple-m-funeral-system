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
app.use(express.json());

// Database Connection with Render SSL
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Universal Login Handler
const handleLoginRequest = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email.trim()]);
    const user = rows[0];

    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({
        success: true,
        token,
        user: { 
          id: String(user.id), 
          email: user.email, 
          firstName: user.first_name, 
          lastName: user.last_name, 
          role: user.role 
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Database query error on login:', err);
    return res.status(500).json({ error: 'Database error occurred. Please try again.' });
  }
};

// Accept all API login variants
app.post('/api/login', handleLoginRequest);
app.post('/api/login.php', handleLoginRequest);

// Universal Me Handler
const handleMeRequest = async (req, res) => {
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
};

app.get('/api/me', handleMeRequest);
app.get('/api/me.php', handleMeRequest);

// Serve Static React Frontend
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
