import { Evaluation, EvaluationSubmission } from "@/domain/entities/Evaluation";

export interface IEvaluationRepository {
  findById(id: string): Promise<Evaluation | null>;
  findByCourseId(courseId: string): Promise<Evaluation[]>;
  save(evaluation: Evaluation): Promise<Evaluation>;
  saveSubmission(submission: EvaluationSubmission): Promise<EvaluationSubmission>;
}
