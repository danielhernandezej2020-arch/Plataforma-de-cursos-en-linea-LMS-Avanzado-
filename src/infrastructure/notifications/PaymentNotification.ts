/**
 * Patrón Bridge — Rol: RefinedAbstraction (Pago)
 *
 * Notificación específica del evento "pago procesado".
 * Construye el mensaje con los datos del pago y delega la entrega
 * al canal inyectado en el constructor (INotificationChannel).
 *
 * Se puede combinar con cualquier canal sin modificar esta clase:
 *   new PaymentNotification(new EmailNotificationChannel())
 *   new PaymentNotification(new ConsoleNotificationChannel())
 */

import { Notification } from "@/domain/services/notifications/Notification";

export class PaymentNotification extends Notification {
  async notify(
    recipient: string,
    data: Record<string, string>
  ): Promise<void> {
    const subject = `Confirmación de pago — ${data.provider ?? "Pasarela de pago"}`;
    const body =
      `Hola ${data.userName ?? recipient},\n\n` +
      `Hemos procesado tu pago correctamente.\n` +
      `  Monto        : $${data.amount}\n` +
      `  Proveedor    : ${data.provider ?? "N/A"}\n` +
      `  Transacción  : ${data.transactionId ?? "N/A"}\n\n` +
      `Gracias por tu compra.`;

    await this.channel.send(recipient, subject, body);
  }
}
