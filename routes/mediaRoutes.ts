
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as mediaController from '../controllers/mediaController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', authenticate, authorize(['admin']), upload.single('file'), mediaController.uploadMedia);
router.get('/', authenticate, authorize(['admin']), mediaController.getMedia);
router.put('/:id/assign', authenticate, authorize(['admin']), mediaController.assignMedia);
router.delete('/:id', authenticate, authorize(['admin']), mediaController.deleteMedia);

export default router;
