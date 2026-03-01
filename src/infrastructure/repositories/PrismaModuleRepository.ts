import { PrismaClient } from "@/lib/prisma";
import { IModuleRepository } from "@/domain/repositories/IModuleRepository";
import { Module } from "@/domain/entities/Module";

export class PrismaModuleRepository implements IModuleRepository {
  constructor(private prisma: PrismaClient) {}

  async findByCourseId(courseId: string): Promise<Module[]> {
    return this.prisma.module.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });
  }

  async save(module: Module): Promise<Module> {
    return this.prisma.module.create({ data: module });
  }
}
