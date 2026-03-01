import { IPaymentRepository } from "@/domain/repositories/IPaymentRepository";
import { IPaymentProviderFactory } from "@/domain/factories/IPaymentProviderFactory";
import { PaymentProviderRegistry } from "@/infrastructure/payments/PaymentProviderRegistry";
import { ProcessPaymentDTO } from "@/application/dto/ProcessPaymentDTO";
import { Payment } from "@/domain/entities/Payment";
import { v4 as uuidv4 } from "uuid";

export class PaymentService {
  constructor(
    private paymentRepository: IPaymentRepository,
    private providerFactory: IPaymentProviderFactory // FACTORY injected
  ) {}

  async processPayment(dto: ProcessPaymentDTO): Promise<Payment> {
    const registry = PaymentProviderRegistry.getInstance(); // SINGLETON
    const idempotencyKey = `${dto.userId}-${dto.courseId}`;

    if (registry.isProcessed(idempotencyKey)) {
      throw new Error("Payment already processed for this course");
    }

    // Factory creates the right provider based on user selection
    const provider = this.providerFactory.create(dto.provider); // FACTORY METHOD
    const result = await provider.processPayment(dto.amount, dto.userId, {
      courseId: dto.courseId,
    });

    const payment: Payment = {
      id: uuidv4(),
      userId: dto.userId,
      courseId: dto.courseId,
      amount: dto.amount,
      provider: dto.provider,
      status: result.success ? "completed" : "failed",
      transactionId: result.transactionId,
      createdAt: new Date(),
    };

    await this.paymentRepository.save(payment);

    if (result.success) {
      registry.markProcessed(idempotencyKey); // SINGLETON tracks processed payments
    }

    return payment;
  }
}
