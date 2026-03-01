import { Evaluation } from "@/domain/entities/Evaluation";
import { CreateEvaluationDTO } from "@/application/dto/CreateEvaluationDTO";

export interface IEvaluationFactory {
  create(dto: CreateEvaluationDTO): Evaluation;
}
