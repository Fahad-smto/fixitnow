import { JwtPayload } from './common.interface';

// Extends Express's Request type globally so req.user is typed everywhere
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
