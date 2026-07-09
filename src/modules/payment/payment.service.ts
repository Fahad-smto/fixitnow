import { randomUUID } from 'crypto';
import prisma from '../../config/prisma';
import { CreatePaymentDto, ConfirmPaymentDto } from './payment.interface';

// TODO: replace this with a real Stripe/SSLCommerz SDK call
const createGatewaySession = async (provider: string) => {
  const transactionId = randomUUID();
  return { transactionId, sessionUrl: `https://mock-${provider}-checkout.com/session/${transactionId}` };
};

// Returns { payment, sessionUrl }, or null if the booking isn't ready for payment
export const createPayment = async (customerId: string, dto: CreatePaymentDto) => {
  const booking = await prisma.booking.findUnique({ where: { id: dto.bookingId } });
  if (!booking || booking.status !== 'ACCEPTED') return null;

  const session = await createGatewaySession(dto.provider);

  const payment = await prisma.payment.create({
    data: {
      bookingId: dto.bookingId,
      customerId,
      amount: booking.amount,
      method: dto.provider,
      provider: dto.provider,
      status: 'pending',
      transactionId: session.transactionId,
    },
  });

  return { payment, sessionUrl: session.sessionUrl };
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
