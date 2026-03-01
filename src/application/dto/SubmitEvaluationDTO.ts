export interface SubmitEvaluationDTO {
  evaluationId: string;
  userId: string;
  answers: number[] | Record<string, unknown>;
}
