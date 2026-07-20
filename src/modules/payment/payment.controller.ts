import { Request, Response, NextFunction } from 'express';
import * as paymentService from './payment.service';
import { stripe } from '../../lib/stripe';
import { CreatePaymentDto } from './payment.interface';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// POST /api/payments/create
export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: CreatePaymentDto = req.body;

    if (!dto.bookingId) {
      res.status(400).json({ success: false, message: 'bookingId is required' });
      return;
    }

    const result = await paymentService.createPayment(req.user!.id, dto.bookingId);

    if (!result) {
      res.status(400).json({ success: false, message: 'Booking not found or not yet ACCEPTED' });
      return;
    }

    res.status(201).json({ success: true, data: result }); // { paymentUrl }
  } catch (err) {
    next(err);
  }
};

// GET /api/payments
export const getMyPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await paymentService.getMyPayments(req.user!.id);
    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};


export const confirmPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { transactionId, status } = req.body;
    console.log(req.body);
      console.log('confirmPayment called with:', { transactionId, status });
    if (!transactionId || !status) {
      res.status(400).json({ success: false, message: 'transactionId and status are required' });
      return;
    }

    const updatedPayment = await paymentService.confirmPayment({ transactionId, status });

    if (!updatedPayment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    res.status(200).json({ success: true, data: updatedPayment });
  } catch (err) {
    next(err);
  }
};


// GET /api/payments/:id
export const getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);

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

export const handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const signature = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err: any) {
    console.log('⚠️  Webhook signature verification failed.', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        console.log(`✅ Checkout session ${session.id} completed`);

        const updated = await paymentService.confirmPayment({
          transactionId: session.id, // এখানেও session.id, payment_intent.id না
          status: 'completed',
        });

        if (!updated) {
          console.log(`⚠️  No matching payment found for transactionId: ${session.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};