/**
 * Patrón Composite — Rol: Composite
 *
 * Nodo raíz del árbol de contenido de un curso. Envuelve la entidad
 * Course existente y gestiona una colección de ICourseContent (típicamente
 * ModuleContent). getDuration() suma de forma recursiva la duración de
 * todos los hijos, permitiendo que el cliente calcule la duración total
 * del curso sin conocer su estructura interna.
 *
 * Ejemplo de uso:
 *   const courseTree = new CourseContent(course);
 *   modules.forEach(m => courseTree.add(new ModuleContent(m)));
 *   console.log(courseTree.getDuration()); // total en minutos
 */

import { Course } from "@/domain/entities/Course";
import { ICourseContent } from "@/domain/composite/ICourseContent";

export class CourseContent implements ICourseContent {
  private children: ICourseContent[] = [];

  constructor(private readonly course: Course) {}

  get id(): string {
    return this.course.id;
  }

  get title(): string {
    return this.course.title;
  }

  getDescription(): string {
    return this.course.description;
  }

  /** Suma recursiva de la duración de todos los hijos. */
  getDuration(): number {
    return this.children.reduce(
      (total, child) => total + child.getDuration(),
      0
    );
  }

  getChildren(): ICourseContent[] {
    return [...this.children];
  }

  isLeaf(): boolean {
    return false;
  }

  add(content: ICourseContent): void {
    this.children.push(content);
  }

  /** Si el nodo no existe, la operación es silenciosa. */
  remove(content: ICourseContent): void {
    this.children = this.children.filter((c) => c !== content);
  }

  getCourse(): Course {
    return this.course;
  }
}
