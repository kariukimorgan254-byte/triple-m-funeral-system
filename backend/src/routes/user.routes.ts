import { Router } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /api/users - Fetch staff list
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, createdAt: true },
      orderBy: { firstName: 'asc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// POST /api/users - Create new staff account
router.post('/', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;
    const passwordHash = await bcrypt.hash(password || 'StaffPassword123!', 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: role || 'STAFF',
        phone: phone || null,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create staff account' });
  }
});

export default router;