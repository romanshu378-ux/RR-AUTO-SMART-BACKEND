
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/authRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import serviceRoutes from './routes/serviceRoutes';
import projectRoutes from './routes/projectRoutes';
import mediaRoutes from './routes/mediaRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Fix: Define __dirname for environments where it is missing (like ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/media', mediaRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running perfectly on port ${PORT}`);
});

export default app;