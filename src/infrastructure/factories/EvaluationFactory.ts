import { IEvaluationFactory } from "@/domain/factories/IEvaluationFactory";
import { Evaluation } from "@/domain/entities/Evaluation";
import { CreateEvaluationDTO, QuizQuestion } from "@/application/dto/CreateEvaluationDTO";
import { v4 as uuidv4 } from "uuid";

export class EvaluationFactory implements IEvaluationFactory {
  create(dto: CreateEvaluationDTO): Evaluation {
    if (dto.type === "quiz") {
      return this.createQuiz(dto);
    }
    return this.createProject(dto);
  }

  private createQuiz(dto: CreateEvaluationDTO): Evaluation {
    const questions = dto.questions as QuizQuestion[];
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Quiz must have at least one question");
    }

    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error("Each quiz question must have a question text and at least 2 options");
      }
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        throw new Error("correctIndex must be a valid index within options");
      }
    }

    return {
      id: uuidv4(),
      courseId: dto.courseId,
      title: dto.title,
      type: "quiz",
      passingScore: dto.passingScore ?? 70,
      questions: questions,
      createdAt: new Date(),
    };
  }

  private createProject(dto: CreateEvaluationDTO): Evaluation {
    return {
      id: uuidv4(),
      courseId: dto.courseId,
      title: dto.title,
      type: "project",
      passingScore: dto.passingScore ?? 60,
      questions: dto.questions,
      createdAt: new Date(),
    };
  }
}
