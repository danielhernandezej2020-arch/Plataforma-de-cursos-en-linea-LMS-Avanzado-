import { PrismaClient } from "@/lib/prisma";
import { IPaymentRepository } from "@/domain/repositories/IPaymentRepository";
import { Payment } from "@/domain/entities/Payment";

export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaClient) {}

  async findCompletedPayment(
    userId: string,
    courseId: string
  ): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: { userId, courseId, status: "completed" },
    });
    return payment as Payment | null;
  }

  async save(payment: Payment): Promise<Payment> {
    const created = await this.prisma.payment.create({
      data: payment,
    });
    return created as Payment;
  }
}
