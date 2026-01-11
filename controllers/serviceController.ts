
import { Request, Response } from 'express';
import db from '../config/db';

export const getServices = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, m.file_path as image_url 
      FROM services s 
      LEFT JOIN media m ON s.image_id = m.id 
      WHERE s.is_active = 1
    `);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, image_id, is_active } = req.body;
    const [result]: any = await db.execute(
      'INSERT INTO services (title, slug, description, image_id, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, slug, description, image_id, is_active ?? true]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, image_id, is_active } = req.body;
    await db.execute(
      'UPDATE services SET title=?, slug=?, description=?, image_id=?, is_active=? WHERE id=?',
      [title, slug, description, image_id, is_active, req.params.id]
    );
    res.json({ message: 'Service updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    await db.execute('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
