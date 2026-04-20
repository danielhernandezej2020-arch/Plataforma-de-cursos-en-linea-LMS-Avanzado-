/**
 * Patrón Composite — Rol: Component
 *
 * Interfaz común para nodos hoja (ModuleContent) y nodos compuestos
 * (CourseContent) en el árbol de contenido de un curso. El cliente
 * puede tratar uniformemente un módulo individual o un curso completo
 * sin conocer si está tratando con una hoja o con un compuesto.
 *
 * Árbol de contenido típico:
 *   CourseContent (raíz)
 *   ├── ModuleContent  (hoja)
 *   ├── ModuleContent  (hoja)
 *   └── ModuleContent  (hoja)
 */

export interface ICourseContent {
  readonly id: string;
  readonly title: string;
  getDescription(): string;
  /**
   * Duración estimada en minutos.
   * Hojas: estimación fija según presencia de videoUrl.
   * Compuestos: suma recursiva de sus hijos.
   */
  getDuration(): number;
  /** Las hojas devuelven []. Los compuestos devuelven sus hijos registrados. */
  getChildren(): ICourseContent[];
  /** Permite distinguir hojas de compuestos sin usar instanceof. */
  isLeaf(): boolean;
}
