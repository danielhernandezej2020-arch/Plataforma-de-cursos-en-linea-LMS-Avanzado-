import type { EventHandler, LMSEventPayload, LMSEventType } from "./types";

class EventBusImpl {
  private static instance: EventBusImpl;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly listeners = new Map<LMSEventType, Set<EventHandler<any>>>();

  private constructor() {}

  static getInstance(): EventBusImpl {
    if (!EventBusImpl.instance) {
      EventBusImpl.instance = new EventBusImpl();
    }
    return EventBusImpl.instance;
  }

  subscribe<T extends LMSEventType>(event: T, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.listeners.get(event)?.delete(handler);
  }

  publish<T extends LMSEventType>(event: T, payload: LMSEventPayload[T]): void {
    this.listeners.get(event)?.forEach(handler => handler(payload));
  }
}

export const eventBus = EventBusImpl.getInstance();
