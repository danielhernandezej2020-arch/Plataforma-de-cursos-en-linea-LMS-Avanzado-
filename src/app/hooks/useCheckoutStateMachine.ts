"use client";

import { useCallback, useRef, useState } from "react";
import { CheckoutContext, type CheckoutData } from "../patterns/states/CheckoutState";

/**
 * Instancia un CheckoutContext (máquina de estados) y expone su interfaz
 * a los componentes React. Usa un contador interno para forzar re-renders
 * cada vez que el contexto cambia de estado o actualiza datos.
 */
export function useCheckoutStateMachine() {
  const [, setTick] = useState(0);
  const ctxRef = useRef<CheckoutContext | null>(null);

  if (!ctxRef.current) {
    ctxRef.current = new CheckoutContext(() => setTick(t => t + 1));
  }
  const ctx = ctxRef.current;

  const proceed    = useCallback(() => ctx.proceed(), [ctx]);
  const goBack     = useCallback(() => ctx.goBack(), [ctx]);
  const updateData = useCallback(
    (patch: Partial<CheckoutData>) => ctx.patchData(patch),
    [ctx],
  );

  return {
    stepName:   ctx.getStepName(),
    data:       { ...ctx.data },
    canProceed: ctx.canProceed(),
    proceed,
    goBack,
    showBack:   ctx.showBack(),
    getLabel:   () => ctx.getLabel(),
    updateData,
  };
}
