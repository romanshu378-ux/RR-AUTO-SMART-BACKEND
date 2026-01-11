
import { Response } from 'express';
import db from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    let query = `
      SELECT p.*, u.name as client_name, s.title as service_name, st.name as status_name 
      FROM projects p 
      JOIN users u ON p.user_id = u.id 
      JOIN services s ON p.service_id = s.id 
      JOIN statuses st ON p.status_id = st.id
    `;
    let params: any[] = [];

    if (req.user?.role !== 'admin') {
      query += ' WHERE p.user_id = ?';
      params.push(req.user?.id);
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { user_id, service_id, title, description } = req.body;
    const [result]: any = await db.execute(
      'INSERT INTO projects (user_id, service_id, title, description) VALUES (?, ?, ?, ?)',
      [user_id, service_id, title, description]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProjectStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status_id } = req.body;
    await db.execute('UPDATE projects SET status_id = ? WHERE id = ?', [status_id, req.params.id]);
    res.json({ message: 'Project status updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
