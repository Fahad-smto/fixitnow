import prisma from '../../config/prisma';
import { TechnicianFilterQuery, UpdateProfileDto, AvailabilitySlot, UpdateBookingStatusDto } from './technician.interface';

// Booking/availability records are linked to TechnicianProfile.id, not User.id.
// This helper finds the profile that belongs to the logged-in user.
export const getProfileByUserId = async (userId: string) => {
  return prisma.technicianProfile.findUnique({ where: { userId } });
};

export const findAllTechnicians = async (filters: TechnicianFilterQuery) => {
  return prisma.technicianProfile.findMany({
    where: {
      rating: filters.rating ? { gte: Number(filters.rating) } : undefined,
    },
    include: { user: { select: { id: true, name: true, email: true } }, services: true },
  });
};

// Returns the technician profile, or null if not found
export const findTechnicianById = async (id: string) => {
  return prisma.technicianProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      services: true,
      bookings: { include: { review: true } },
    },
  });
};

export const updateProfile = async (userId: string, dto: UpdateProfileDto) => {
  return prisma.technicianProfile.update({ where: { userId }, data: dto });
};

export const updateAvailability = async (userId: string, slots: AvailabilitySlot[]) => {
  return prisma.technicianProfile.update({
    where: { userId },
    data: { availability: slots as unknown as object },
  });
};

export const getBookingsForTechnician = async (technicianProfileId: string) => {
  return prisma.booking.findMany({
    where: { technicianId: technicianProfileId },
    include: { customer: { select: { id: true, name: true } }, service: true },
  });
};

// Returns the updated booking, or null if it doesn't belong to this technician
export const updateBookingStatus = async (
  bookingId: string,
  technicianProfileId: string,
  dto: UpdateBookingStatusDto
) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, technicianId: technicianProfileId },
  });
  if (!booking) return null;

  return prisma.booking.update({ where: { id: bookingId }, data: { status: dto.status } });
};
