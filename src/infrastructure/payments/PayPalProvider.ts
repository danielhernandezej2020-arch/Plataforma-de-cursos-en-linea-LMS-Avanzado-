import { IPaymentProvider, PaymentResult } from "@/domain/services/IPaymentProvider";

export class PayPalProvider implements IPaymentProvider {
  readonly name = "paypal";

  async processPayment(
    amount: number,
    userId: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult> {
    console.log(
      `[PayPal] Processing $${amount} for user ${userId}`,
      metadata
    );

    await this.simulateNetworkDelay();

    return {
      success: true,
      transactionId: `paypal_txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      provider: this.name,
      amount,
    };
  }

  async refund(transactionId: string): Promise<{ success: boolean }> {
    console.log(`[PayPal] Refunding transaction ${transactionId}`);
    await this.simulateNetworkDelay();
    return { success: true };
  }

  private simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 150));
  }
}
