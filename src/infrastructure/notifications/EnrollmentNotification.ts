/**
 * Patrón Bridge — Rol: RefinedAbstraction (Inscripción)
 *
 * Notificación específica del evento "estudiante inscrito en un curso".
 * Construye el mensaje con los datos del evento y delega la entrega
 * al canal inyectado en el constructor (INotificationChannel).
 *
 * Se puede combinar con cualquier canal sin modificar esta clase:
 *   new EnrollmentNotification(new EmailNotificationChannel())
 *   new EnrollmentNotification(new ConsoleNotificationChannel())
 */

import { Notification } from "@/domain/services/notifications/Notification";

export class EnrollmentNotification extends Notification {
  async notify(
    recipient: string,
    data: Record<string, string>
  ): Promise<void> {
    const subject = `¡Bienvenido al curso "${data.courseName}"!`;
    const body =
      `Hola ${data.studentName ?? recipient},\n\n` +
      `Te has inscrito exitosamente en el curso "${data.courseName}".\n` +
      `Instructor: ${data.instructorName ?? "No especificado"}\n\n` +
      `¡Mucho éxito en tu aprendizaje!`;

    await this.channel.send(recipient, subject, body);
  }
}
