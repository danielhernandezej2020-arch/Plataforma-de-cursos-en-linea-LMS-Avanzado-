/**
 * Patrón Adapter — Rol: Adapter
 *
 * Envuelve `StripeSDK` (Adaptee) mediante composición y expone
 * la interfaz `IPaymentProvider` (Target) que el resto del sistema espera.
 *
 * Traducciones realizadas:
 *  - amount (dólares)  →  amountInCents = amount * 100  (StripeSDK espera centavos)
 *  - userId            →  customerId
 *  - metadata.description → description (o valor por defecto)
 *  - StripeChargeResponse → PaymentResult
 *    · id              →  transactionId
 *    · status === "succeeded"  →  success: true
 *    · amount / 100    →  amount (devuelve dólares)
 *  - StripeRefundResponse → { success: boolean }
 *    · status === "succeeded"  →  success: true
 */

import { IPaymentProvider, PaymentResult } from "@/domain/services/IPaymentProvider";
import { StripeSDK } from "@/infrastructure/payments/external/StripeSDK";

export class StripePaymentAdapter implements IPaymentProvider {
  readonly name = "stripe";

  constructor(private readonly stripeSDK: StripeSDK) {}

  async processPayment(
    amount: number,
    userId: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult> {
    const amountInCents = Math.round(amount * 100);
    const description = metadata.description ?? `Payment for user ${userId}`;

    const response = await this.stripeSDK.charge(amountInCents, userId, description);

    return {
      success: response.status === "succeeded",
      transactionId: response.id,
      provider: this.name,
      amount: response.amount / 100,
      error: response.status !== "succeeded" ? `Stripe status: ${response.status}` : undefined,
    };
  }

  async refund(transactionId: string): Promise<{ success: boolean }> {
    const response = await this.stripeSDK.refundCharge(transactionId);
    return { success: response.status === "succeeded" };
  }
}
