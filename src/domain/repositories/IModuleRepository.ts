import { Module } from "@/domain/entities/Module";

export interface IModuleRepository {
  findByCourseId(courseId: string): Promise<Module[]>;
  save(module: Module): Promise<Module>;
}
