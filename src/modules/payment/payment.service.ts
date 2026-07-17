import prisma from '../../config/prisma';
import { stripe } from '../../lib/stripe';
import { ConfirmPaymentDto } from './payment.interface';

// Returns { paymentUrl }, or null if the booking isn't ready for payment
export const createPayment = async (customerId: string, bookingId: string) => {
  // ধাপ ১: booking খুঁজে বের করো, ঠিক status-এ আছে কিনা চেক করো
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.status !== 'ACCEPTED') {
    return null;
  }

  // ধাপ ২: user-এর জন্য একটা Stripe customer আছে কিনা দেখো, না থাকলে বানাও
  const user = await prisma.user.findUniqueOrThrow({ where: { id: customerId } });
  let stripeCustomerId = user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: { id: customerId },
      data: { stripeCustomerId },
    });
  }

  // ধাপ ৩: Stripe checkout session তৈরি করো
  // ⚠️ এখানে payment_intent expand করার দরকার নেই —
  // নতুন Stripe API ভার্সনে PaymentIntent session তৈরি হওয়ার সাথে সাথে তৈরি হয় না,
  // customer সত্যিই checkout সম্পন্ন করলে তখন তৈরি হয়। তাই session.id ব্যবহার করছি।
  const session = await stripe.checkout.sessions.create({
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
  await prisma.payment.upsert({
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

// Webhook থেকে কল হবে — payment সফল/ব্যর্থ হলে DB আপডেট করে
export const confirmPayment = async (dto: ConfirmPaymentDto) => {
  const payment = await prisma.payment.findUnique({ where: { transactionId: dto.transactionId } });
  console.log('confirmPayment called with:', dto, 'found payment:', payment);
  if (!payment) return null;

  const updated = await prisma.payment.update({
    where: { transactionId: dto.transactionId },
     
    data: { status: dto.status, paidAt: dto.status === 'completed' ? new Date() : null },
  });

  if (dto.status === 'completed') {
    await prisma.booking.update({ where: { id: payment.bookingId }, data: { status: 'PAID' } });
  }

  return updated;
};

export const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({ where: { customerId }, include: { booking: true } });
};

// Returns the payment, or null if not found
export const getPaymentById = async (id: string) => {
  return prisma.payment.findUnique({ where: { id } });
};