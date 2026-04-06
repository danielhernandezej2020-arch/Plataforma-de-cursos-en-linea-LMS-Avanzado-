/**
 * EXTERNAL SDK — no se puede modificar.
 *
 * Simulación del SDK oficial de PayPal.
 * Su API es completamente incompatible con IPaymentProvider:
 *  - El monto se pasa como string ("19.99"), no como number.
 *  - El método de pago se llama `executePayment`, no `processPayment`.
 *  - La respuesta está anidada en purchase_units[] y payer{}.
 *  - Los estados son "approved"/"failed"/"pending", no boolean.
 *  - Los reembolsos usan `refundTransaction` con estructura propia.
 */

export interface PayPalPaymentResponse {
  purchase_units: Array<{
    reference_id: string;
    amount: { value: string };
  }>;
  payer: { payer_id: string };
  transaction_id: string;   // prefijo "PAY-"
  state: "approved" | "failed" | "pending";
}

export interface PayPalRefundResponse {
  refund_id: string;        // prefijo "REFUND-"
  state: "completed" | "failed";
}

export class PayPalSDK {
  async executePayment(
    totalAmount: string,
    currency: string,
    payerId: string,
    note: string
  ): Promise<PayPalPaymentResponse> {
    console.log(
      `[PayPalSDK] Executing payment of ${totalAmount} ${currency} for payer ${payerId} — "${note}"`
    );

    await this.simulateLatency();

    const referenceId = `REF-${Date.now()}`;

    return {
      purchase_units: [
        {
          reference_id: referenceId,
          amount: { value: totalAmount },
        },
      ],
      payer: { payer_id: payerId },
      transaction_id: `PAY-${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      state: "approved",
    };
  }

  async refundTransaction(transactionId: string): Promise<PayPalRefundResponse> {
    console.log(`[PayPalSDK] Refunding transaction ${transactionId}`);

    await this.simulateLatency();

    return {
      refund_id: `REFUND-${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      state: "completed",
    };
  }

  private simulateLatency(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}
