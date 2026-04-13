/**
 * Patrón Decorator — Rol: Decorator Base (abstracto)
 *
 * Envuelve cualquier `IPaymentProvider` y delega las llamadas al componente
 * interior. Las subclases concretas sobreescriben solo los métodos que necesitan
 * extender, añadiendo comportamiento antes o después de la delegación.
 *
 * Gracias a este decorador base, cada ConcreteDecorator solo necesita
 * sobreescribir el método que extiende; el resto se delega automáticamente.
 */

import { IPaymentProvider, PaymentResult } from "@/domain/services/IPaymentProvider";

export abstract class PaymentProviderDecorator implements IPaymentProvider {
  constructor(protected readonly wrapped: IPaymentProvider) {}

  get name(): string {
    return this.wrapped.name;
  }

  async processPayment(
    amount: number,
    userId: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult> {
    return this.wrapped.processPayment(amount, userId, metadata);
  }

  async refund(transactionId: string): Promise<{ success: boolean }> {
    return this.wrapped.refund(transactionId);
  }
}
