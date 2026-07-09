export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CreateBookingDto {
  technicianId: string; // TechnicianProfile.id
  serviceId: string;
  timeSlot: string; // ISO date string
  address?: string;
  notes?: string;
}

export interface BookingDto {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  timeSlot: Date;
  address: string | null;
  notes: string | null;
  amount: number;
  status: BookingStatus;
}
