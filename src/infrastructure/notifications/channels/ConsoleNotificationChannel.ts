/**
 * Patrón Bridge — Rol: ConcreteImplementor (Console)
 *
 * Canal de entrega que imprime el mensaje en la consola del servidor.
 * Útil para desarrollo, depuración y entornos donde aún no se ha
 * configurado un servicio de mensajería externo.
 */

import { INotificationChannel } from "@/domain/services/notifications/INotificationChannel";

export class ConsoleNotificationChannel implements INotificationChannel {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log("─────────────────────────────────────────");
    console.log(`[Notificación → Console]`);
    console.log(`  Para    : ${to}`);
    console.log(`  Asunto  : ${subject}`);
    console.log(`  Cuerpo  :\n${body}`);
    console.log("─────────────────────────────────────────");
  }
}
