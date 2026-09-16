import { Router } from 'express';
import { prisma } from '../prisma';
import { upload } from '../middleware/upload';

const router = Router();

function publicUrl(filename: string) {
  return '/uploads/' + filename;
}

// POST /api/media/upload
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });
    const url = publicUrl(req.file.filename);
    res.status(201).json({ url, filename: req.file.filename });
  } catch (e) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// PATCH /api/media/casket/:id/image
router.patch('/casket/:id/image', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = publicUrl(req.file.filename);
    }
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const item = await prisma.casketCatalog.update({
      where: { id: req.params.id },
      data: { imageUrl },
    });
    res.json(item);
  } catch (e) {
    console.error('Update casket image error:', e);
    res.status(500).json({ error: 'Failed to update casket image' });
  }
});

// PATCH /api/media/hearse/:id/image
router.patch('/hearse/:id/image', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = publicUrl(req.file.filename);
    }

    const item = await prisma.hearse.update({
      where: { id: req.params.id },
      data: { imageUrl },
    });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update hearse image' });
  }
});

export default router;