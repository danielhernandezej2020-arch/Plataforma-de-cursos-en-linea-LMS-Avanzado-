/**
 * Patrón Decorator — Rol: ConcreteDecorator (Logging)
 *
 * Añade registro de actividad (logging) antes y después de cada operación
 * de pago y reembolso sin modificar los adaptadores existentes
 * (StripePaymentAdapter, PayPalPaymentAdapter) ni la interfaz IPaymentProvider.
 *
 * Puede apilarse con otros decoradores:
 *   new LoggingPaymentDecorator(new RetryPaymentDecorator(stripeAdapter, 3))
 */

import { PaymentResult } from "@/domain/services/IPaymentProvider";
import { PaymentProviderDecorator } from "@/infrastructure/payments/decorators/PaymentProviderDecorator";

export class LoggingPaymentDecorator extends PaymentProviderDecorator {
  async processPayment(
    amount: number,
    userId: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult> {
    console.log(
      `[Decorator:Logging][${this.name}] processPayment → amount=${amount}, userId=${userId}`
    );
    const result = await super.processPayment(amount, userId, metadata);
    console.log(
      `[Decorator:Logging][${this.name}] processPayment ← success=${result.success}, txId=${result.transactionId}`
    );
    return result;
  }

  async refund(transactionId: string): Promise<{ success: boolean }> {
    console.log(
      `[Decorator:Logging][${this.name}] refund → txId=${transactionId}`
    );
    const result = await super.refund(transactionId);
    console.log(
      `[Decorator:Logging][${this.name}] refund ← success=${result.success}`
    );
    return result;
  }
}
