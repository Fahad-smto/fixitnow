import { Request, Response, NextFunction } from 'express';

// Catches any unexpected error that happens inside a controller
// (e.g. a database connection issue). Normal "not found" / "invalid input"
// errors are handled directly inside each controller with res.status(...).
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Something went wrong on the server' });
};
