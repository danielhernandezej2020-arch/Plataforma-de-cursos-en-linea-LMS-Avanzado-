import { Enrollment } from "@/domain/entities/Enrollment";
import { Payment } from "@/domain/entities/Payment";

export interface EnrollmentResultDTO {
  enrollment: Enrollment;
  /** Undefined si el curso es gratuito */
  payment?: Payment;
  /** Indica si las notificaciones fueron enviadas exitosamente */
  notified: boolean;
}
