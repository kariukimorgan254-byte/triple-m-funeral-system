import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET /api/hearses - Fetch fleet with upcoming assignments
router.get('/', async (req, res) => {
  try {
    const fleet = await prisma.hearse.findMany({
      where: { isActive: true },
      include: {
        assignments: {
          orderBy: { scheduledDate: 'asc' },
          take: 5,
        },
      },
      orderBy: { vehicleName: 'asc' },
    });
    res.json(fleet);
  } catch (error) {
    console.error('Fetch hearses error:', error);
    res.status(500).json({ error: 'Failed to fetch hearses' });
  }
});

// POST /api/hearses - Add a new vehicle to fleet
router.post('/', async (req, res) => {
  try {
    const { vehicleName, make, model, year, licensePlate, vin, currentMileage, status } = req.body;

    const newHearse = await prisma.hearse.create({
      data: {
        vehicleName,
        make: make || 'Cadillac',
        model: model || 'Coach',
        year: parseInt(year) || new Date().getFullYear(),
        licensePlate,
        vin: vin || null,
        currentMileage: parseInt(currentMileage) || 0,
        status: status || 'AVAILABLE',
      },
    });

    res.status(201).json(newHearse);
  } catch (error) {
    console.error('Add hearse error:', error);
    res.status(500).json({ error: 'Failed to add vehicle to fleet' });
  }
});

// PUT /api/hearses/:id/service - Log maintenance / update mileage & status
router.put('/:id/service', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentMileage, nextServiceMileage, nextServiceDate, status } = req.body;

    const updatedHearse = await prisma.hearse.update({
      where: { id },
      data: {
        currentMileage: currentMileage ? parseInt(currentMileage) : undefined,
        nextServiceMileage: nextServiceMileage ? parseInt(nextServiceMileage) : undefined,
        nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined,
        status: status || undefined,
      },
    });

    res.json(updatedHearse);
  } catch (error) {
    console.error('Update hearse maintenance error:', error);
    res.status(500).json({ error: 'Failed to update vehicle maintenance' });
  }
});

export default router;
