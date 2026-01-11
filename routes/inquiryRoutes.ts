
import { Router } from 'express';
import * as inquiryController from '../controllers/inquiryController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Public / Guest can post
router.post('/', (req, res, next) => {
    // Optional auth for auto-assigning user_id
    authenticate(req as any, res, () => { next(); });
}, inquiryController.createInquiry);

router.get('/', authenticate, authorize(['admin']), inquiryController.getAllInquiries);
router.get('/user', authenticate, inquiryController.getAllInquiries);
router.get('/:id', authenticate, inquiryController.getInquiryById);
router.put('/:id/status', authenticate, authorize(['admin']), inquiryController.updateInquiryStatus);
router.delete('/:id', authenticate, authorize(['admin']), inquiryController.deleteInquiry);

export default router;
