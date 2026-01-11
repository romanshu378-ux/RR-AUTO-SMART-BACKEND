
import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', serviceController.getServices);
router.post('/', authenticate, authorize(['admin']), serviceController.createService);
router.put('/:id', authenticate, authorize(['admin']), serviceController.updateService);
router.delete('/:id', authenticate, authorize(['admin']), serviceController.deleteService);

export default router;
