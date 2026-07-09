import { Request, Response, NextFunction } from 'express';
import * as paymentService from './payment.service';
import { CreatePaymentDto, ConfirmPaymentDto } from './payment.interface';

// POST /api/payments/create
export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: CreatePaymentDto = req.body;
    const result = await paymentService.createPayment(req.user!.id, dto);

    if (!result) {
      res.status(400).json({ success: false, message: 'Booking not found or not yet ACCEPTED' });
      return;
    }

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/confirm (webhook/callback from Stripe or SSLCommerz)
export const confirmPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: ConfirmPaymentDto = req.body;
    const updated = await paymentService.confirmPayment(dto);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments
export const getMyPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await paymentService.findMyPayments(req.user!.id);
    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/:id
export const getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await paymentService.findPaymentById(req.params.id);

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    const isOwner = payment.customerId === req.user!.id;
    if (!isOwner && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};
