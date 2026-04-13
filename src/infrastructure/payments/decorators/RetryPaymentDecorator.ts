/**
 * Patrón Decorator — Rol: ConcreteDecorator (Retry)
 *
 * Reintenta automáticamente `processPayment` hasta `maxRetries` veces
 * en caso de fallo (result.success === false o excepción lanzada), con una
 * pausa de backoff lineal entre intentos. No modifica los adaptadores
 * existentes ni la interfaz IPaymentProvider.
 *
 * Puede apilarse con otros decoradores:
 *   new LoggingPaymentDecorator(new RetryPaymentDecorator(stripeAdapter, 3))
 */

import { IPaymentProvider, PaymentResult } from "@/domain/services/IPaymentProvider";
import { PaymentProviderDecorator } from "@/infrastructure/payments/decorators/PaymentProviderDecorator";

export class RetryPaymentDecorator extends PaymentProviderDecorator {
  constructor(
    wrapped: IPaymentProvider,
    private readonly maxRetries: number = 3,
    private readonly delayMs: number = 500
  ) {
    super(wrapped);
  }

  async processPayment(
    amount: number,
    userId: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult> {
    let lastResult: PaymentResult | undefined;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await super.processPayment(amount, userId, metadata);
        if (result.success) return result;
        lastResult = result;
      } catch (err) {
        lastResult = {
          success: false,
          transactionId: "",
          provider: this.name,
          amount,
          error: String(err),
        };
      }

      if (attempt < this.maxRetries) {
        await new Promise<void>((r) => setTimeout(r, this.delayMs * attempt));
      }
    }

    return lastResult!;
  }
}
