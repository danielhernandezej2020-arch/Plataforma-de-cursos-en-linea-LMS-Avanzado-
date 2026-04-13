/**
 * Patrón Bridge — Rol: Abstraction
 *
 * Clase base de la jerarquía de notificaciones. Mantiene una referencia al
 * Implementor (INotificationChannel) inyectado por constructor. Las subclases
 * (RefinedAbstraction) saben *qué* mensaje construir; el canal sabe *cómo*
 * entregarlo. La combinación se resuelve en tiempo de ejecución sin necesidad
 * de crear subclases combinadas.
 *
 * Uso:
 *   const notif = new EnrollmentNotification(new EmailNotificationChannel());
 *   await notif.notify("user@example.com", { courseName: "TypeScript avanzado" });
 */

import { INotificationChannel } from "@/domain/services/notifications/INotificationChannel";

export abstract class Notification {
  constructor(protected readonly channel: INotificationChannel) {}

  /**
   * Construye el mensaje específico del evento y lo entrega a través del canal.
   * @param recipient  Destinatario (email, userId, teléfono…)
   * @param data       Datos del evento necesarios para armar el mensaje
   */
  abstract notify(recipient: string, data: Record<string, string>): Promise<void>;
}
