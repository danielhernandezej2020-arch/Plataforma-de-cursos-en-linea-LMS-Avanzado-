/**
 * Patrón Bridge — Rol: Implementor
 *
 * Define el contrato de entrega de notificaciones, completamente independiente
 * de qué tipo de evento genera la notificación. Los canales concretos
 * (Email, Console, SMS, etc.) implementan esta interfaz sin conocer la
 * jerarquía de abstracciones de notificación.
 *
 * Al separar "qué notificar" (Abstraction) de "cómo entregarlo" (Implementor),
 * el Bridge evita la explosión combinatoria de subclases:
 *   sin Bridge → M tipos × N canales = M×N clases
 *   con Bridge  → M tipos + N canales = M+N clases
 */

export interface INotificationChannel {
  /**
   * Entrega un mensaje al destinatario indicado.
   * @param to       Identificador del destinatario (email, teléfono, userId…)
   * @param subject  Asunto o título del mensaje
   * @param body     Cuerpo completo del mensaje
   */
  send(to: string, subject: string, body: string): Promise<void>;
}
