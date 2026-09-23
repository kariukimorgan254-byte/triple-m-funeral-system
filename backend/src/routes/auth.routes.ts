import { Router } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await prisma.user.findUnique({ where: { email } });
    
    // Auto-create default admin user if database is fresh/empty
    if (!user && email === 'director@fhms.com') {
      const defaultHash = await bcrypt.hash('AdminPassword123!', 10);
      user = await prisma.user.create({
        data: {
          email: 'director@fhms.com',
          passwordHash: defaultHash,
          firstName: 'Arthur',
          lastName: 'Pendleton',
          role: 'ADMIN',
          phone: '555-0199',
        },
      });
      console.log('✅ Auto-created default admin user: director@fhms.com');
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET || 'fhms_super_secret_jwt_key_2024',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
