export interface TechnicianFilterQuery {
  type?: string;
  location?: string;
  rating?: string;
}

export interface UpdateProfileDto {
  skills?: string[];
  experience?: number;
  pricing?: number;
  bio?: string;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityDto {
  slots: AvailabilitySlot[];
}

export interface UpdateBookingStatusDto {
  status: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED';
}
