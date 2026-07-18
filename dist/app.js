"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const service_routes_1 = __importDefault(require("./modules/service/service.routes"));
const technician_routes_1 = require("./modules/technician/technician.routes");
const category_routes_1 = __importDefault(require("./modules/category/category.routes"));
const booking_routes_1 = __importDefault(require("./modules/booking/booking.routes"));
const payment_routes_1 = __importDefault(require("./modules/payment/payment.routes"));
const review_routes_1 = __importDefault(require("./modules/review/review.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const app = (0, express_1.default)();
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
app.use("/api/payment/webhook", express_1.default.raw({ type: "application/json" }));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/services', service_routes_1.default);
app.use('/api/technicians', technician_routes_1.publicRouter);
app.use('/api/technician', technician_routes_1.privateRouter);
app.use('/api/categories', category_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map