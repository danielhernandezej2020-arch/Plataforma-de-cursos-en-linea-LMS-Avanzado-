import type { Dispatch, SetStateAction } from "react";

export interface ICommand {
  execute(): void;
  undo(): void;
  readonly description: string;
}

/**
 * Navega a una pregunta concreta y recuerda el índice anterior para poder
 * revertir la navegación con undo().
 */
export class NavigateQuestionCommand implements ICommand {
  private previousIndex = -1;
  readonly description: string;

  constructor(
    private readonly getCurrent: () => number,
    private readonly setCurrent: Dispatch<SetStateAction<number>>,
    private readonly targetIndex: number,
  ) {
    this.description = `Navigate to question ${targetIndex + 1}`;
  }

  execute(): void {
    this.previousIndex = this.getCurrent();
    this.setCurrent(this.targetIndex);
  }

  undo(): void {
    if (this.previousIndex !== -1) {
      this.setCurrent(this.previousIndex);
    }
  }
}

/**
 * Registra la respuesta seleccionada por el usuario y guarda la anterior
 * para poder restaurarla con undo().
 */
export class AnswerQuestionCommand implements ICommand {
  private previousAnswer = -1;
  readonly description: string;

  constructor(
    private readonly questionIndex: number,
    private readonly optionIndex: number,
    private readonly getAnswers: () => number[],
    private readonly setAnswers: Dispatch<SetStateAction<number[]>>,
  ) {
    this.description = `Answer Q${questionIndex + 1} with option ${optionIndex + 1}`;
  }

  execute(): void {
    this.previousAnswer = this.getAnswers()[this.questionIndex] ?? -1;
    this.setAnswers(prev => {
      const next = [...prev];
      next[this.questionIndex] = this.optionIndex;
      return next;
    });
  }

  undo(): void {
    const prev = this.previousAnswer;
    this.setAnswers(answers => {
      const next = [...answers];
      next[this.questionIndex] = prev;
      return next;
    });
  }
}
