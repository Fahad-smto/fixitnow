import { Router } from 'express';
import * as serviceController from './service.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', serviceController.getAllServices);
router.post('/', protect, authorize('technician'), serviceController.createService);

export default router;