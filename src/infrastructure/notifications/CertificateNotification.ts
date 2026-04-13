/**
 * Patrón Bridge — Rol: RefinedAbstraction (Certificado)
 *
 * Notificación específica del evento "certificado emitido".
 * Construye el mensaje con los datos del certificado y delega la entrega
 * al canal inyectado en el constructor (INotificationChannel).
 *
 * Se puede combinar con cualquier canal sin modificar esta clase:
 *   new CertificateNotification(new EmailNotificationChannel())
 *   new CertificateNotification(new ConsoleNotificationChannel())
 */

import { Notification } from "@/domain/services/notifications/Notification";

export class CertificateNotification extends Notification {
  async notify(
    recipient: string,
    data: Record<string, string>
  ): Promise<void> {
    const subject = `Tu certificado de "${data.courseName}" está listo`;
    const body =
      `Hola ${data.studentName ?? recipient},\n\n` +
      `¡Felicitaciones! Has completado el curso "${data.courseName}" y\n` +
      `tu certificado ha sido emitido exitosamente.\n\n` +
      `  Código de certificado : ${data.certificateCode}\n` +
      `  Tipo                  : ${data.certificateType ?? "básico"}\n` +
      `  Fecha de emisión      : ${data.issuedAt ?? new Date().toLocaleDateString("es-CO")}\n\n` +
      `¡Sigue aprendiendo!`;

    await this.channel.send(recipient, subject, body);
  }
}
