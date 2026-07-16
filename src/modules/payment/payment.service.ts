import prisma from '../../config/prisma';
import {  ConfirmPaymentDto } from './payment.interface';
import { stripe } from '../../lib/stripe';



export const createPayment = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
    });

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;

       
      await tx.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: process.env.STRIPE_PRODUCT_PRICE_ID!, quantity: 1 }],
      mode: 'payment',
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      success_url: `${process.env.FRONTEND_URL}/payment?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/payment?success=false`,
      metadata: { userId: user.id },
    });

    return session.url;
  });

  return { paymentUrl: transactionResult };
};








// Returns the updated payment, or null if the transaction doesn't exist
export const confirmPayment = async (dto: ConfirmPaymentDto) => {
  const payment = await prisma.payment.findUnique({ where: { transactionId: dto.transactionId } });
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

export const findMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({ where: { customerId }, include: { booking: true } });
};

// Returns the payment, or null if not found
export const findPaymentById = async (id: string) => {
  return prisma.payment.findUnique({ where: { id } });
};
