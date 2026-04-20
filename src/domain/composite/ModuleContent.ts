/**
 * Patrón Composite — Rol: Leaf
 *
 * Nodo terminal del árbol de contenido. Envuelve la entidad Module
 * existente sin modificarla. No admite hijos; getChildren() siempre
 * devuelve []. La duración es una estimación basada en la presencia
 * de videoUrl.
 */

import { Module } from "@/domain/entities/Module";
import { ICourseContent } from "@/domain/composite/ICourseContent";

const TEXT_ONLY_DURATION_MINUTES = 5;
const VIDEO_DURATION_MINUTES = 10;

export class ModuleContent implements ICourseContent {
  constructor(private readonly module: Module) {}

  get id(): string {
    return this.module.id;
  }

  get title(): string {
    return this.module.title;
  }

  getDescription(): string {
    return this.module.content;
  }

  getDuration(): number {
    return this.module.videoUrl
      ? VIDEO_DURATION_MINUTES
      : TEXT_ONLY_DURATION_MINUTES;
  }

  getChildren(): ICourseContent[] {
    return [];
  }

  isLeaf(): boolean {
    return true;
  }

  getModule(): Module {
    return this.module;
  }
}
