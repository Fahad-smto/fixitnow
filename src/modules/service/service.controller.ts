import { Request, Response, NextFunction } from 'express';
import * as serviceService from './service.service';
import * as technicianService from '../technician/technician.service';
import { ServiceFilterQuery, CreateServiceDto } from './service.interface';

// GET /api/services
export const getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = req.query as ServiceFilterQuery;
    const services = await serviceService.findAllServices(filters);
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
};

// POST /api/services (technician only)
export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: CreateServiceDto = req.body;

    if (!dto.categoryId || !dto.title || dto.price === undefined) {
      res.status(400).json({ success: false, message: 'categoryId, title and price are required' });
      return;
    }

    // Booking/service records use TechnicianProfile.id, not User.id,
    // so we first find the profile that belongs to the logged-in technician.
    const profile = await technicianService.getProfileByUserId(req.user!.id);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Technician profile not found. Update your profile first.' });
      return;
    }

    const service = await serviceService.createService(profile.id, dto);
    if (!service) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};