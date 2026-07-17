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
import { stripe } from './lib/stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const app: Application = express();

// app.post("/api/payment/webhook", express.raw({ type: "application/json" }),(request,response)=>{
//   let event = request.body;
//   console.log("webhook",event)
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = request.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature as string,
//         endpointSecret
//       );
//     } catch (err:any) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.sendStatus(400);
//     }
//   }
//   console.log("event after try block",event)

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });


app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/technicians', technicianPublicRoutes);
app.use('/api/technician', technicianPrivateRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
