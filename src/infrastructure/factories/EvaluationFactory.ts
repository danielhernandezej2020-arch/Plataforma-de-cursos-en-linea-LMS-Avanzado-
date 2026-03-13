import { IEvaluationFactory } from "@/domain/factories/IEvaluationFactory";
import { Evaluation } from "@/domain/entities/Evaluation";
import { CreateEvaluationDTO } from "@/application/dto/CreateEvaluationDTO";
import { EvaluationBuilder } from "@/domain/builders/EvaluationBuilder";

export class EvaluationFactory implements IEvaluationFactory {
  create(dto: CreateEvaluationDTO): Evaluation {
    const passingScore = dto.passingScore ?? (dto.type === "quiz" ? 70 : 60);

    return new EvaluationBuilder()
      .withCourseId(dto.courseId)
      .withTitle(dto.title)
      .withType(dto.type)
      .withPassingScore(passingScore)
      .withQuestions(dto.questions)
      .build(); // BUILDER
  }
}
