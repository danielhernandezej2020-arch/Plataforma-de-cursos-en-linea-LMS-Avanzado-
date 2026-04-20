/**
 * Patrón Facade — LearningFacade
 *
 * Simplifica el flujo de inscripción de un estudiante, que internamente
 * implica hasta 4 subsistemas independientes:
 *   1. CourseService    → verificar existencia y tipo del curso
 *   2. PaymentService   → procesar pago si el curso es premium
 *   3. EnrollmentService → crear la inscripción
 *   4. Notificaciones   → enviar confirmación de inscripción (y pago)
 *
 * Sin Facade, el llamador (controlador API, componente React, test) tendría
 * que conocer el orden exacto, manejar la condicional del pago y coordinar
 * los errores de cada subsistema. Con Facade, todo eso queda en un solo
 * método: enrollStudent().
 *
 * Uso típico:
 *   const result = await learningFacade.enrollStudent(
 *     "user-123",
 *     "course-abc",
 *     { amount: 49.99, provider: "stripe" }   // solo si es premium
 *   );
 */

import { CourseService } from "@/application/services/CourseService";
import { EnrollmentService } from "@/application/services/EnrollmentService";
import { PaymentService } from "@/application/services/PaymentService";
import { EnrollmentNotification } from "@/infrastructure/notifications/EnrollmentNotification";
import { PaymentNotification } from "@/infrastructure/notifications/PaymentNotification";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { EnrollmentResultDTO } from "@/application/dto/EnrollmentResultDTO";
import { ProcessPaymentDTO } from "@/application/dto/ProcessPaymentDTO";

/** Datos de pago sin userId/courseId (los aporta enrollStudent como parámetros explícitos) */
export type PaymentInput = Omit<ProcessPaymentDTO, "userId" | "courseId">;

export class LearningFacade {
  constructor(
    private readonly courseService: CourseService,
    private readonly paymentService: PaymentService,
    private readonly enrollmentService: EnrollmentService,
    private readonly enrollmentNotification: EnrollmentNotification,
    private readonly paymentNotification: PaymentNotification,
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Orquesta el flujo completo de inscripción:
   *   1. Obtiene el curso → verifica existencia
   *   2. Si es premium, procesa el pago con paymentInput (requerido)
   *   3. Crea la inscripción
   *   4. Envía notificaciones (best-effort: un fallo no revierte la inscripción)
   *
   * @param userId       ID del estudiante a inscribir
   * @param courseId     ID del curso objetivo
   * @param paymentInput Datos de pago (amount, provider). Requerido para cursos premium.
   */
  async enrollStudent(
    userId: string,
    courseId: string,
    paymentInput?: PaymentInput
  ): Promise<EnrollmentResultDTO> {
    // Paso 1: obtener el curso para conocer su tipo
    const course = await this.courseService.getCourse(courseId);

    // Paso 2: procesar pago si el curso es premium
    let payment = undefined;
    if (course.type === "premium") {
      if (!paymentInput) {
        throw new Error(
          "Se requieren datos de pago para inscribirse en un curso premium"
        );
      }
      payment = await this.paymentService.processPayment({
        userId,
        courseId,
        amount: paymentInput.amount,
        provider: paymentInput.provider,
      });
    }

    // Paso 3: crear la inscripción
    const enrollment = await this.enrollmentService.enroll(userId, courseId);

    // Paso 4: notificaciones (best-effort)
    let notified = false;
    try {
      const user = await this.userRepository.findById(userId);
      const studentName = user?.name ?? userId;
      const studentEmail = user?.email ?? userId;

      await this.enrollmentNotification.notify(studentEmail, {
        courseName: course.title,
        studentName,
      });

      if (payment) {
        await this.paymentNotification.notify(studentEmail, {
          userName: studentName,
          amount: String(payment.amount),
          provider: payment.provider,
          transactionId: payment.transactionId ?? "N/A",
        });
      }

      notified = true;
    } catch (error) {
      console.warn("[LearningFacade] Fallo al enviar notificaciones:", error);
    }

    return { enrollment, payment, notified };
  }
}
