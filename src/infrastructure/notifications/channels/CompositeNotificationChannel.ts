/**
 * Patrón Composite — Rol: Composite (canal de notificación compuesto)
 *
 * Implementa INotificationChannel y contiene una colección de canales hijos
 * (también INotificationChannel). Al llamar a send(), el mensaje se despacha
 * a TODOS los canales registrados de forma concurrente mediante Promise.all.
 *
 * Permite tratar un grupo de canales exactamente igual que un canal único,
 * eliminando la necesidad de que el llamador gestione bucles o lógica de
 * fanout. El Facade (LearningFacade) puede inyectar este canal compuesto
 * como si fuera cualquier otro INotificationChannel.
 *
 * Ejemplo:
 *   const canal = new CompositeNotificationChannel();
 *   canal.add(new EmailNotificationChannel());
 *   canal.add(new ConsoleNotificationChannel());
 *   // Un solo send() entrega el mensaje por email Y por consola
 */

import { INotificationChannel } from "@/domain/services/notifications/INotificationChannel";

export class CompositeNotificationChannel implements INotificationChannel {
  private channels: INotificationChannel[] = [];

  /** Registra un canal hijo en el compuesto. */
  add(channel: INotificationChannel): void {
    this.channels.push(channel);
  }

  /** Si el canal no está registrado, la operación es silenciosa. */
  remove(channel: INotificationChannel): void {
    this.channels = this.channels.filter((c) => c !== channel);
  }

  /**
   * Despacha el mensaje a todos los canales registrados en paralelo.
   * Si algún canal lanza un error, Promise.all lo propaga al llamador.
   */
  async send(to: string, subject: string, body: string): Promise<void> {
    await Promise.all(
      this.channels.map((canal) => canal.send(to, subject, body))
    );
  }
}
