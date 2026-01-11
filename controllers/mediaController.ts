
import { Request, Response } from 'express';
import db from '../config/db';

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { page, section } = req.body;
    const filePath = `/uploads/${req.file.filename}`;
    
    const [result]: any = await db.execute(
      'INSERT INTO media (file_name, file_path, page, section) VALUES (?, ?, ?, ?)',
      [req.file.originalname, filePath, page, section]
    );

    res.status(201).json({ id: result.insertId, path: filePath });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMedia = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM media ORDER BY created_at DESC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const assignMedia = async (req: Request, res: Response) => {
  try {
    const { page, section } = req.body;
    await db.execute('UPDATE media SET page = ?, section = ? WHERE id = ?', [page, section, req.params.id]);
    res.json({ message: 'Media assigned successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    // Note: In production, also delete physical file from disk using fs.unlink
    await db.execute('DELETE FROM media WHERE id = ?', [req.params.id]);
    res.json({ message: 'Media record deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
