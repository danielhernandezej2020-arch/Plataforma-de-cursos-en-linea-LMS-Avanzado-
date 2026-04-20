import { Course } from "@/domain/entities/Course";
import { Module } from "@/domain/entities/Module";
import { Evaluation } from "@/domain/entities/Evaluation";
import { CourseContent } from "@/domain/composite/CourseContent";

export interface CourseOverviewDTO {
  course: Course;
  modules: Module[];
  evaluations: Evaluation[];
  /** Árbol Composite preconstruido para cálculo de duración e iteración */
  contentTree: CourseContent;
  /** Duración total estimada en minutos (suma de todos los módulos) */
  totalDurationMinutes: number;
}
