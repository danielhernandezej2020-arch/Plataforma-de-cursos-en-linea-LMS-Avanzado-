"use client";

import { useCallback, useEffect, useRef } from "react";
import { eventBus } from "../patterns/observer/EventBus";
import type { EventHandler, LMSEventPayload, LMSEventType } from "../patterns/observer/types";

/**
 * Suscribe el componente a un evento del bus. Se desuscribe automáticamente
 * al desmontar. Usa una ref interna para que el handler no necesite ser
 * estable (no obliga al llamador a usar useCallback).
 */
export function useEventBus<T extends LMSEventType>(
  event: T,
  handler: EventHandler<T>,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return eventBus.subscribe(event, payload => handlerRef.current(payload));
  }, [event]);
}

/** Devuelve una función estable para publicar eventos desde cualquier componente. */
export function usePublish() {
  return useCallback(<T extends LMSEventType>(event: T, payload: LMSEventPayload[T]) => {
    eventBus.publish(event, payload);
  }, []);
}
