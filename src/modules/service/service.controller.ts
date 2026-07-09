import { Request, Response, NextFunction } from 'express';
import * as serviceService from './service.service';
import { ServiceFilterQuery } from './service.interface';

export const getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = req.query as ServiceFilterQuery;
    const services = await serviceService.findAllServices(filters);
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
};
