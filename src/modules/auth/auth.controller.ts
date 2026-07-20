import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newUser = await authService.registerUser(req.body);

    if (!newUser) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }

    res.status(201).json({
      success: true,
      data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);

    console.log('Login result:', result); // Debugging line to check the result

    if (!result) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const { token, user } = result;
    res.status(200).json({
      success: true,
      token,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authService.getCurrentUser(req.user!.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};
