import { Router } from 'express';
import * as paymentController from './payment.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.post('/create', protect, authorize('customer'), paymentController.createPayment);
router.post('/webhook', paymentController.handleWebhook); // gateway webhook/callback, no auth
router.post('/confirm',   paymentController.confirmPayment);
router.get('/', protect, paymentController.getMyPayments);
router.get('/:id', protect, paymentController.getPaymentById);

export default router;