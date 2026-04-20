/**
 * Patrón Facade — CourseManagementFacade
 *
 * Simplifica dos operaciones de gestión de cursos que internamente
 * coordinan múltiples servicios y construyen el árbol Composite:
 *
 *   createCourseWithContent() — crea curso + módulos + evaluación (opcional)
 *     en un solo llamado, devolviendo además el árbol ICourseContent listo.
 *
 *   getCourseOverview() — obtiene curso, módulos y evaluaciones en paralelo
 *     y construye el árbol Composite con la duración total calculada.
 *
 * Sin Facade, el llamador debería:
 *   - Conocer el orden correcto de llamadas (curso antes que módulos)
 *   - Construir manualmente el árbol Composite tras cada carga
 *   - Lanzar y coordinar las llamadas paralelas en getCourseOverview
 */

import { CourseService } from "@/application/services/CourseService";
import { EvaluationService } from "@/application/services/EvaluationService";
import { Course } from "@/domain/entities/Course";
import { Module } from "@/domain/entities/Module";
import { CourseContent } from "@/domain/composite/CourseContent";
import { ModuleContent } from "@/domain/composite/ModuleContent";
import { CreateCourseWithContentDTO } from "@/application/dto/CreateCourseWithContentDTO";
import { CourseSetupResultDTO } from "@/application/dto/CourseSetupResultDTO";
import { CourseOverviewDTO } from "@/application/dto/CourseOverviewDTO";

export class CourseManagementFacade {
  constructor(
    private readonly courseService: CourseService,
    private readonly evaluationService: EvaluationService
  ) {}

  /**
   * Crea un curso completo con sus módulos y evaluación inicial opcional.
   * Los módulos se crean de forma secuencial para preservar el orderIndex.
   */
  async createCourseWithContent(
    dto: CreateCourseWithContentDTO
  ): Promise<CourseSetupResultDTO> {
    const course = await this.courseService.createCourse(dto.course);

    const modules: Module[] = [];
    for (const moduleInput of dto.modules) {
      const saved = await this.courseService.addModule(course.id, {
        title: moduleInput.title,
        content: moduleInput.content,
        orderIndex: moduleInput.orderIndex,
        videoUrl: moduleInput.videoUrl,
      });
      modules.push(saved);
    }

    let evaluation = undefined;
    if (dto.evaluation) {
      evaluation = await this.evaluationService.createEvaluation({
        ...dto.evaluation,
        courseId: course.id,
      });
    }

    const contentTree = this.buildContentTree(course, modules);

    return { course, modules, evaluation, contentTree };
  }

  /**
   * Obtiene un resumen completo del curso. Las tres consultas se lanzan
   * en paralelo para minimizar la latencia total.
   */
  async getCourseOverview(courseId: string): Promise<CourseOverviewDTO> {
    const [course, modules, evaluations] = await Promise.all([
      this.courseService.getCourse(courseId),
      this.courseService.getCourseModules(courseId),
      this.evaluationService.getEvaluationsByCourse(courseId),
    ]);

    const contentTree = this.buildContentTree(course, modules);
    const totalDurationMinutes = contentTree.getDuration();

    return { course, modules, evaluations, contentTree, totalDurationMinutes };
  }

  private buildContentTree(course: Course, modules: Module[]): CourseContent {
    const tree = new CourseContent(course);
    modules.forEach((m) => tree.add(new ModuleContent(m)));
    return tree;
  }
}
