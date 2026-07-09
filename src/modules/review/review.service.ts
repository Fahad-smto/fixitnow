import prisma from '../../config/prisma';
import { CreateReviewDto } from './review.interface';

// Returns the booking, or null if it doesn't exist
export const findBookingById = async (bookingId: string) => {
  return prisma.booking.findUnique({ where: { id: bookingId } });
};

export const createReview = async (customerId: string, dto: CreateReviewDto, technicianId: string) => {
  return prisma.review.create({
    data: {
      bookingId: dto.bookingId,
      customerId,
      technicianId,
      rating: dto.rating,
      comment: dto.comment,
    },
  });
};
