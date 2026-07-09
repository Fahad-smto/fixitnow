import { Request, Response, NextFunction } from 'express';
import * as reviewService from './review.service';
import { CreateReviewDto } from './review.interface';

// POST /api/reviews
export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: CreateReviewDto = req.body;

    const booking = await reviewService.findBookingById(dto.bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.customerId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    if (booking.status !== 'COMPLETED') {
      res.status(400).json({ success: false, message: 'Booking must be COMPLETED before you can review it' });
      return;
    }

    const review = await reviewService.createReview(req.user!.id, dto, booking.technicianId);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};
