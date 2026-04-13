/**
 * Patrón Bridge — Rol: ConcreteImplementor (Email)
 *
 * Canal de entrega que simula el envío de un correo electrónico.
 * En producción este canal integraría un proveedor real (SendGrid,
 * SES, Resend, etc.) sin afectar en absoluto la jerarquía de
 * abstracciones de notificación.
 */

import { INotificationChannel } from "@/domain/services/notifications/INotificationChannel";

export class EmailNotificationChannel implements INotificationChannel {
  async send(to: string, subject: string, body: string): Promise<void> {
    // En producción: await emailProvider.send({ to, subject, html: body });
    console.log(`[Notificación → Email] Para: ${to} | Asunto: "${subject}"`);
    console.log(`  Cuerpo: ${body}`);
  }
}
