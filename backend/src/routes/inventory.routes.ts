import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET /api/inventory - Catalog summary with stock counts and image URLs
router.get('/', async (req, res) => {
  try {
    const catalog = await prisma.casketCatalog.findMany({
      where: { isActive: true },
      include: { inventory: true },
      orderBy: { createdAt: 'desc' },
    });

    const summary = catalog.map((item) => {
      const inStockUnits = item.inventory.filter((i) => i.status === 'IN_STOCK');
      const totalStock = inStockUnits.length;
      const reserved = item.inventory.filter((i) => i.status === 'RESERVED').length;
      return {
        id: item.id,
        sku: item.sku,
        name: item.name,
        material: item.material,
        size: item.size,
        wholesalePrice: item.wholesalePrice,
        retailPrice: item.retailPrice,
        minimumStockLevel: item.minimumStockLevel,
        currentStock: totalStock,
        reservedStock: reserved,
        isLowStock: totalStock <= item.minimumStockLevel,
        imageUrl: item.imageUrl, // <-- Added missing imageUrl property
        units: item.inventory,
      };
    });

    res.json(summary);
  } catch (error) {
    console.error('Fetch inventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// GET /api/inventory/available-units
router.get('/available-units', async (req, res) => {
  try {
    const availableUnits = await prisma.casketInventory.findMany({
      where: { status: 'IN_STOCK' },
      include: { catalog: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(availableUnits);
  } catch (error) {
    console.error('Fetch available units error:', error);
    res.status(500).json({ error: 'Failed to fetch available caskets' });
  }
});

// POST /api/inventory/catalog - Add a new casket model
router.post('/catalog', async (req, res) => {
  try {
    const {
      sku, name, description, material, size, finish, interiorType,
      wholesalePrice, retailPrice, minimumStockLevel, reorderPoint, imageUrl
    } = req.body;

    const newCatalogItem = await prisma.casketCatalog.create({
      data: {
        sku: sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
        name,
        description: description || null,
        material: material || 'SOLID_WOOD',
        size: size || 'STANDARD',
        finish: finish || null,
        interiorType: interiorType || null,
        wholesalePrice: parseFloat(wholesalePrice) || 0,
        retailPrice: parseFloat(retailPrice) || 0,
        minimumStockLevel: parseInt(minimumStockLevel) || 2,
        reorderPoint: parseInt(reorderPoint) || 3,
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json(newCatalogItem);
  } catch (error) {
    console.error('Create catalog item error:', error);
    res.status(500).json({ error: 'Failed to create casket model' });
  }
});

// POST /api/inventory/unit - Receive physical stock unit
router.post('/unit', async (req, res) => {
  try {
    const { catalogId, serialNumber, storageLocation, purchasePrice } = req.body;

    const newUnit = await prisma.casketInventory.create({
      data: {
        catalogId,
        serialNumber: serialNumber || 'SN-' + Math.floor(100000 + Math.random() * 900000),
        storageLocation: storageLocation || 'Main Bay',
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
        purchaseDate: new Date(),
        status: 'IN_STOCK',
      },
      include: { catalog: true },
    });

    res.status(201).json(newUnit);
  } catch (error) {
    console.error('Receive stock unit error:', error);
    res.status(500).json({ error: 'Failed to receive stock unit' });
  }
});

export default router;
