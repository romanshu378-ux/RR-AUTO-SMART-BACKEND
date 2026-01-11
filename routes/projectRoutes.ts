
import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, projectController.getProjects);
router.post('/', authenticate, authorize(['admin']), projectController.createProject);
router.put('/:id/status', authenticate, authorize(['admin']), projectController.updateProjectStatus);

export default router;
