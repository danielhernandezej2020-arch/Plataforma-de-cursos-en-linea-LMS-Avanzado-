export interface PaymentResult {
  success: boolean;
  transactionId: string;
  provider: string;
  amount: number;
  error?: string;
}

export interface IPaymentProvider {
  readonly name: string;
  processPayment(
    amount: number,
    userId: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult>;
  refund(transactionId: string): Promise<{ success: boolean }>;
}
