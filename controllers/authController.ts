
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { AuthRequest } from '../middlewares/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await db.execute(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, role || 'customer']
    );

    res.status(201).json({ message: 'User registered', userId: result.insertId });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const [rows]: any = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user?.id]
    );
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
