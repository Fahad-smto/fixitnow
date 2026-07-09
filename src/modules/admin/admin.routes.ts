import { Router } from 'express';
import * as adminController from './admin.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.patch('/users/:id', adminController.updateUserStatus);
router.get('/bookings', adminController.getAllBookings);
router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.createCategory);

export default router;
