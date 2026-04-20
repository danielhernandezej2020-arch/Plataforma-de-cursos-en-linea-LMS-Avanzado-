import { CreateCourseDTO } from "@/application/dto/CreateCourseDTO";
import { CreateEvaluationDTO } from "@/application/dto/CreateEvaluationDTO";

export interface ModuleInputDTO {
  title: string;
  content: string;
  orderIndex: number;
  videoUrl?: string;
}

export interface CreateCourseWithContentDTO {
  course: CreateCourseDTO;
  modules: ModuleInputDTO[];
  /** Si se omite, el curso se crea sin evaluación inicial */
  evaluation?: Omit<CreateEvaluationDTO, "courseId">;
}
