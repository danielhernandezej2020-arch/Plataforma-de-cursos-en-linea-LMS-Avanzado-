import { Evaluation } from "@/domain/entities/Evaluation";
import { IPrototype } from "@/domain/prototypes/IPrototype";
import { QuizQuestion } from "@/application/dto/CreateEvaluationDTO";
import { v4 as uuidv4 } from "uuid";

type EvaluationOverrides = Partial<Pick<Evaluation, "courseId" | "title" | "passingScore" | "type">>;

export class EvaluationPrototype implements IPrototype<Evaluation, EvaluationOverrides> {
  constructor(private readonly source: Evaluation) {}

  clone(overrides?: EvaluationOverrides): Evaluation {
    const questions = Array.isArray(this.source.questions)
      ? (this.source.questions as QuizQuestion[]).map((q) => ({
          ...q,
          options: [...q.options],
        }))
      : this.source.questions;

    return {
      id: uuidv4(),
      courseId: this.source.courseId,
      title: this.source.title,
      type: this.source.type,
      passingScore: this.source.passingScore,
      questions,
      createdAt: new Date(),
      ...overrides,
    };
  }
}
