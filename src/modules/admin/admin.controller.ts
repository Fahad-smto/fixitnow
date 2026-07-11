import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { UpdateUserStatusDto, CreateCategoryDto } from './admin.interface';

// GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await adminService.findAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/users/:id
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: UpdateUserStatusDto = req.body;

    if (!['active', 'banned'].includes(dto.status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const updated = await adminService.updateUserStatus(req.params.id, dto);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/bookings
export const getAllBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookings = await adminService.findAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/categories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await adminService.findAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/categories
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: CreateCategoryDto = req.body;

    if (!dto.name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const category = await adminService.createCategory(dto);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
