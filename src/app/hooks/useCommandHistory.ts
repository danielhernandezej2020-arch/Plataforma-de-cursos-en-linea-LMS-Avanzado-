"use client";

import { useCallback, useState } from "react";
import type { ICommand } from "../patterns/commands/QuizCommands";

/**
 * Mantiene un historial de comandos ejecutados y expone execute/undo.
 * Permite navegar hacia atrás deshaciendo el último comando ejecutado,
 * lo que da soporte a "Anterior" en el quiz sin lógica de navegación manual.
 */
export function useCommandHistory() {
  const [history, setHistory] = useState<ICommand[]>([]);

  const execute = useCallback((command: ICommand) => {
    command.execute();
    setHistory(prev => [...prev, command]);
  }, []);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      last.undo();
      return prev.slice(0, -1);
    });
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return {
    execute,
    undo,
    canUndo: history.length > 0,
    history: history as readonly ICommand[],
    clearHistory,
  };
}
