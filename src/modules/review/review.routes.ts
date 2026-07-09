import { Router } from 'express';
import * as reviewController from './review.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', protect, authorize('customer'), reviewController.createReview);

export default router;
