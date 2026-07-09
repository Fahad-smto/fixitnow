export type PaymentProvider = 'stripe' | 'sslcommerz';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface CreatePaymentDto {
  bookingId: string;
  provider: PaymentProvider;
}

export interface ConfirmPaymentDto {
  transactionId: string;
  status: PaymentStatus;
}

export interface PaymentSession {
  transactionId: string;
  sessionUrl: string;
}

export interface PaymentDto {
  id: string;
  bookingId: string;
  transactionId: string;
  amount: number;
  method: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt: Date | null;
}
