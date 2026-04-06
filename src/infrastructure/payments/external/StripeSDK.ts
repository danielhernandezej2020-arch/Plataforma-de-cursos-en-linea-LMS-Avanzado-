/**
 * EXTERNAL SDK — no se puede modificar.
 *
 * Simulación del SDK oficial de Stripe.
 * Su API es completamente incompatible con IPaymentProvider:
 *  - Los montos se expresan en centavos (integer), no en dólares.
 *  - El método de cobro se llama `charge`, no `processPayment`.
 *  - Las respuestas tienen estructura propia (no PaymentResult).
 *  - Los reembolsos usan `refundCharge` y retornan un objeto distinto.
 */

export interface StripeChargeResponse {
  id: string;           // prefijo "ch_"
  amount: number;       // en centavos
  status: "succeeded" | "failed" | "pending";
  customer: string;
  description: string;
}

export interface StripeRefundResponse {
  id: string;           // prefijo "re_"
  status: "succeeded" | "failed";
}

export class StripeSDK {
  async charge(
    amountInCents: number,
    customerId: string,
    description: string
  ): Promise<StripeChargeResponse> {
    console.log(
      `[StripeSDK] Charging ${amountInCents} cents to customer ${customerId} — "${description}"`
    );

    await this.simulateLatency();

    return {
      id: `ch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount: amountInCents,
      status: "succeeded",
      customer: customerId,
      description,
    };
  }

  async refundCharge(chargeId: string): Promise<StripeRefundResponse> {
    console.log(`[StripeSDK] Refunding charge ${chargeId}`);

    await this.simulateLatency();

    return {
      id: `re_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: "succeeded",
    };
  }

  private simulateLatency(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}
