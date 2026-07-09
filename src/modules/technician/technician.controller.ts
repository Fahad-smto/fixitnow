import { Request, Response, NextFunction } from 'express';
import * as technicianService from './technician.service';
import { TechnicianFilterQuery, UpdateProfileDto, UpdateAvailabilityDto, UpdateBookingStatusDto } from './technician.interface';

// GET /api/technicians
export const getAllTechnicians = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = req.query as TechnicianFilterQuery;
    const technicians = await technicianService.findAllTechnicians(filters);
    res.status(200).json({ success: true, data: technicians });
  } catch (err) {
    next(err);
  }
};

// GET /api/technicians/:id
export const getTechnicianById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const technician = await technicianService.findTechnicianById(req.params.id);

    if (!technician) {
      res.status(404).json({ success: false, message: 'Technician not found' });
      return;
    }

    res.status(200).json({ success: true, data: technician });
  } catch (err) {
    next(err);
  }
};

// PUT /api/technician/profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: UpdateProfileDto = req.body;
    const updated = await technicianService.updateProfile(req.user!.id, dto);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// PUT /api/technician/availability
export const updateAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: UpdateAvailabilityDto = req.body;
    const updated = await technicianService.updateAvailability(req.user!.id, dto.slots);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// GET /api/technician/bookings
export const getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await technicianService.getProfileByUserId(req.user!.id);

    if (!profile) {
      res.status(404).json({ success: false, message: 'Technician profile not found' });
      return;
    }

    const bookings = await technicianService.getBookingsForTechnician(profile.id);
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/technician/bookings/:id
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: UpdateBookingStatusDto = req.body;
    const validStatuses = ['ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED'];

    if (!validStatuses.includes(dto.status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const profile = await technicianService.getProfileByUserId(req.user!.id);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Technician profile not found' });
      return;
    }

    const updated = await technicianService.updateBookingStatus(req.params.id, profile.id, dto);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
