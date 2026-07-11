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
