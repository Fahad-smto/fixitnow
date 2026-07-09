import { Router } from 'express';
import * as bookingController from './booking.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', protect, authorize('customer'), bookingController.createBooking);
router.get('/', protect, bookingController.getMyBookings);
router.get('/:id', protect, bookingController.getBookingById);

export default router;
