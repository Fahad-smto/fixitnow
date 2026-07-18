"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getMyPayments = exports.confirmPayment = exports.createPayment = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const stripe_1 = require("../../lib/stripe");
// Returns { paymentUrl }, or null if the booking isn't ready for payment
const createPayment = async (customerId, bookingId) => {
    // ধাপ ১: booking খুঁজে বের করো, ঠিক status-এ আছে কিনা চেক করো
    const booking = await prisma_1.default.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.status !== 'ACCEPTED') {
        return null;
    }
    // ধাপ ২: user-এর জন্য একটা Stripe customer আছে কিনা দেখো, না থাকলে বানাও
    const user = await prisma_1.default.user.findUniqueOrThrow({ where: { id: customerId } });
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
        const customer = await stripe_1.stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: { userId: user.id },
        });
        stripeCustomerId = customer.id;
        await prisma_1.default.user.update({
            where: { id: customerId },
            data: { stripeCustomerId },
        });
    }
    // ধাপ ৩: Stripe checkout session তৈরি করো
    // ⚠️ এখানে payment_intent expand করার দরকার নেই —
    // নতুন Stripe API ভার্সনে PaymentIntent session তৈরি হওয়ার সাথে সাথে তৈরি হয় না,
    // customer সত্যিই checkout সম্পন্ন করলে তখন তৈরি হয়। তাই session.id ব্যবহার করছি।
    const session = await stripe_1.stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: { name: `Booking Payment - ${booking.id}` },
                    unit_amount: Math.round(booking.amount * 100), // cent-এ কনভার্ট করা
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        success_url: `${process.env.FRONTEND_URL}/payment?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/payment?success=false`,
        metadata: { bookingId: booking.id, userId: user.id },
    });
    // ধাপ ৪: upsert ব্যবহার করছি — booking-এর জন্য আগে থেকে Payment থাকলে আপডেট,
    // না থাকলে নতুন তৈরি (একই booking-এ বারবার payment শুরু করলেও এরর হবে না)
    await prisma_1.default.payment.upsert({
        where: { bookingId: booking.id },
        update: {
            transactionId: session.id,
            amount: booking.amount,
            status: 'pending',
            paidAt: null,
        },
        create: {
            booking: { connect: { id: booking.id } },
            customer: { connect: { id: customerId } },
            amount: booking.amount,
            method: 'stripe',
            provider: 'stripe',
            status: 'pending',
            transactionId: session.id,
        },
    });
    return { paymentUrl: session.url };
};
exports.createPayment = createPayment;
// Webhook থেকে কল হবে — payment সফল/ব্যর্থ হলে DB আপডেট করে
const confirmPayment = async (dto) => {
    const payment = await prisma_1.default.payment.findUnique({ where: { transactionId: dto.transactionId } });
    console.log('confirmPayment called with:', dto, 'found payment:', payment);
    if (!payment)
        return null;
    const updated = await prisma_1.default.payment.update({
        where: { transactionId: dto.transactionId },
        data: { status: dto.status, paidAt: dto.status === 'completed' ? new Date() : null },
    });
    if (dto.status === 'completed') {
        await prisma_1.default.booking.update({ where: { id: payment.bookingId }, data: { status: 'PAID' } });
    }
    return updated;
};
exports.confirmPayment = confirmPayment;
const getMyPayments = async (customerId) => {
    return prisma_1.default.payment.findMany({ where: { customerId }, include: { booking: true } });
};
exports.getMyPayments = getMyPayments;
// Returns the payment, or null if not found
const getPaymentById = async (id) => {
    return prisma_1.default.payment.findUnique({ where: { id } });
};
exports.getPaymentById = getPaymentById;
//# sourceMappingURL=payment.service.js.map