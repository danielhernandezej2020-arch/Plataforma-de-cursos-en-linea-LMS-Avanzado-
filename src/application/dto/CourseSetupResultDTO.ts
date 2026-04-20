import { Course } from "@/domain/entities/Course";
import { Module } from "@/domain/entities/Module";
import { Evaluation } from "@/domain/entities/Evaluation";
import { CourseContent } from "@/domain/composite/CourseContent";

export interface CourseSetupResultDTO {
  course: Course;
  modules: Module[];
  /** Undefined si no se solicitó evaluación en el DTO de entrada */
  evaluation?: Evaluation;
  /** Árbol Composite listo para calcular duración y navegar la jerarquía */
  contentTree: CourseContent;
}
