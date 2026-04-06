/**
 * Patrón Adapter — Rol: Adapter
 *
 * Envuelve `PayPalSDK` (Adaptee) mediante composición y expone
 * la interfaz `IPaymentProvider` (Target) que el resto del sistema espera.
 *
 * Traducciones realizadas:
 *  - amount (number)   →  totalAmount = amount.toFixed(2) (PayPalSDK espera string)
 *  - userId            →  payerId
 *  - metadata.note     →  note (o valor por defecto)
 *  - PayPalPaymentResponse → PaymentResult
 *    · transaction_id  →  transactionId
 *    · state === "approved"  →  success: true
 *    · purchase_units[0].amount.value → amount (parseFloat)
 *  - PayPalRefundResponse → { success: boolean }
 *    · state === "completed"  →  success: true
 */

import { IPaymentProvider, PaymentResult } from "@/domain/services/IPaymentProvider";
import { PayPalSDK } from "@/infrastructure/payments/external/PayPalSDK";

export class PayPalPaymentAdapter implements IPaymentProvider {
  readonly name = "paypal";

  constructor(private readonly paypalSDK: PayPalSDK) {}

  async processPayment(
    amount: number,
    userId: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult> {
    const totalAmount = amount.toFixed(2);
    const currency = metadata.currency ?? "USD";
    const note = metadata.note ?? `Payment for user ${userId}`;

    const response = await this.paypalSDK.executePayment(totalAmount, currency, userId, note);

    const returnedAmount = parseFloat(response.purchase_units[0].amount.value);

    return {
      success: response.state === "approved",
      transactionId: response.transaction_id,
      provider: this.name,
      amount: returnedAmount,
      error: response.state !== "approved" ? `PayPal state: ${response.state}` : undefined,
    };
  }

  async refund(transactionId: string): Promise<{ success: boolean }> {
    const response = await this.paypalSDK.refundTransaction(transactionId);
    return { success: response.state === "completed" };
  }
}
