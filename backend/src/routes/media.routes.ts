import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// GET /api/media/:filename - Serve uploaded media files
router.get('/:filename', (req: Request, res: Response) => {
  try {
    const filename = String(req.params.filename);
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'Media file not found' });
      return;
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving media file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/media/:filename - Delete uploaded media file
router.delete('/:filename', (req: Request, res: Response) => {
  try {
    const filename = String(req.params.filename);
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'Media file not found' });
      return;
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Media file deleted successfully' });
  } catch (error) {
    console.error('Error deleting media file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;