import { PrismaClient } from "@/lib/prisma";
import { ICourseRepository } from "@/domain/repositories/ICourseRepository";
import { Course } from "@/domain/entities/Course";

export class PrismaCourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    return course as Course | null;
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    return courses as Course[];
  }

  async findByCategory(category: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: { category },
    });
    return courses as Course[];
  }

  async save(course: Course): Promise<Course> {
    const created = await this.prisma.course.create({ data: course });
    return created as Course;
  }

  async update(id: string, data: Partial<Course>): Promise<Course> {
    const updated = await this.prisma.course.update({
      where: { id },
      data,
    });
    return updated as Course;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({ where: { id } });
  }
}
