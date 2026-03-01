export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ProjectRubric {
  criteria: string;
  maxScore: number;
}

export interface CreateEvaluationDTO {
  courseId: string;
  title: string;
  type: "quiz" | "project";
  passingScore?: number;
  questions: QuizQuestion[] | ProjectRubric[];
}
