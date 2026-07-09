import { Request, Response, NextFunction } from 'express';
import * as bookingService from './booking.service';
import * as technicianService from '../technician/technician.service';
import { CreateBookingDto } from './booking.interface';

// POST /api/bookings
export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: CreateBookingDto = req.body;
    const booking = await bookingService.createBooking(req.user!.id, dto);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings
export const getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    let technicianProfileId: string | undefined;

    if (role === 'technician') {
      const profile = await technicianService.getProfileByUserId(userId);
      if (!profile) {
        res.status(404).json({ success: false, message: 'Technician profile not found' });
        return;
      }
      technicianProfileId = profile.id;
    }

    const bookings = await bookingService.findMyBookings(role, userId, technicianProfileId);
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:id
export const getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await bookingService.findBookingById(req.params.id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const isOwner = booking.customerId === req.user!.id;
    const isAllowed = isOwner || req.user!.role === 'admin' || req.user!.role === 'technician';

    if (!isAllowed) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};
