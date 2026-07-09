import prisma from '../../config/prisma';
import { CreateBookingDto } from './booking.interface';

// Returns the new booking, or null if the service doesn't exist
export const createBooking = async (customerId: string, dto: CreateBookingDto) => {
  const service = await prisma.service.findUnique({ where: { id: dto.serviceId } });
  if (!service) return null;

  return prisma.booking.create({
    data: {
      customerId,
      technicianId: dto.technicianId,
      serviceId: dto.serviceId,
      timeSlot: new Date(dto.timeSlot),
      address: dto.address,
      notes: dto.notes,
      amount: service.price,
      status: 'REQUESTED',
    },
  });
};

export const findMyBookings = async (role: string, userId: string, technicianProfileId?: string) => {
  return prisma.booking.findMany({
    where: role === 'technician' ? { technicianId: technicianProfileId } : { customerId: userId },
    include: { service: true, technician: { include: { user: true } }, customer: true },
  });
};

// Returns the booking, or null if not found
export const findBookingById = async (id: string) => {
  return prisma.booking.findUnique({
    where: { id },
    include: { service: true, technician: true, customer: true },
  });
};
