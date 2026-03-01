import { Payment } from "@/domain/entities/Payment";

export interface IPaymentRepository {
  findCompletedPayment(userId: string, courseId: string): Promise<Payment | null>;
  save(payment: Payment): Promise<Payment>;
}
