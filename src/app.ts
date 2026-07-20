import express, { Application } from 'express';

import authRoutes from './modules/auth/auth.routes';
import serviceRoutes from './modules/service/service.routes';
import { publicRouter as technicianPublicRoutes, privateRouter as technicianPrivateRoutes } from './modules/technician/technician.routes';
import categoryRoutes from './modules/category/category.routes';
import bookingRoutes from './modules/booking/booking.routes';
import paymentRoutes from './modules/payment/payment.routes';
import reviewRoutes from './modules/review/review.routes';
import adminRoutes from './modules/admin/admin.routes';

import { errorHandler } from './middleware/error.middleware';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

 
app.get('/', (req, res) => {
  res.status(200).send(`FixItNow server running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/technicians', technicianPublicRoutes);
app.use('/api/technician', technicianPrivateRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;