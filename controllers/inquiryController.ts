
import { Request, Response } from 'express';
import db from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const createInquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, inquiry_type, message } = req.body;
    const userId = req.user?.id || null;

    const [result]: any = await db.execute(
      'INSERT INTO inquiries (user_id, name, email, phone, inquiry_type, message) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, phone, inquiry_type, message]
    );

    res.status(201).json({ message: 'Inquiry submitted', id: result.insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllInquiries = async (req: AuthRequest, res: Response) => {
  try {
    // Admin sees all, customer sees own
    let query = 'SELECT i.*, s.name as status_name FROM inquiries i JOIN statuses s ON i.status_id = s.id';
    let params: any[] = [];

    if (req.user?.role !== 'admin') {
      query += ' WHERE i.user_id = ?';
      params.push(req.user?.id);
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getInquiryById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      'SELECT i.*, s.name as status_name FROM inquiries i JOIN statuses s ON i.status_id = s.id WHERE i.id = ?',
      [req.params.id]
    );
    const inquiry = rows[0];

    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    if (req.user?.role !== 'admin' && inquiry.user_id !== req.user?.id) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(inquiry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInquiryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status_id } = req.body;
    await db.execute('UPDATE inquiries SET status_id = ? WHERE id = ?', [status_id, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteInquiry = async (req: AuthRequest, res: Response) => {
  try {
    await db.execute('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Inquiry deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
