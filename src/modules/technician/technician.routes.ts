import { Router } from 'express';
import * as technicianController from './technician.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

// Public: GET /api/technicians, /api/technicians/:id
export const publicRouter = Router();
publicRouter.get('/', technicianController.getAllTechnicians);
publicRouter.get('/:id', technicianController.getTechnicianById);

// Private: /api/technician/*  (technician role only)
export const privateRouter = Router();
privateRouter.put('/profile', protect, authorize('technician'), technicianController.updateProfile);
privateRouter.put('/availability', protect, authorize('technician'), technicianController.updateAvailability);
privateRouter.get('/bookings', protect, authorize('technician'), technicianController.getMyBookings);
privateRouter.patch('/bookings/:id', protect, authorize('technician'), technicianController.updateBookingStatus);
