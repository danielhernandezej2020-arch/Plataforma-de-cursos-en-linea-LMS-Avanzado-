export interface Evaluation {
  id: string;
  courseId: string;
  title: string;
  type: "quiz" | "project";
  passingScore: number;
  questions: unknown;
  createdAt: Date;
}

export interface EvaluationSubmission {
  id: string;
  evaluationId: string;
  userId: string;
  answers: unknown;
  score: number;
  passed: boolean;
  submittedAt: Date;
}
