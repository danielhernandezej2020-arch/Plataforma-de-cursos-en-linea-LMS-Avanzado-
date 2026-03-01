import { PrismaClient } from "@/lib/prisma";
import { IEnrollmentRepository } from "@/domain/repositories/IEnrollmentRepository";
import { Enrollment } from "@/domain/entities/Enrollment";

export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<Enrollment | null> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return enrollment as Enrollment | null;
  }

  async findByUserId(userId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
    });
    return enrollments as Enrollment[];
  }

  async save(enrollment: Enrollment): Promise<Enrollment> {
    const created = await this.prisma.enrollment.create({
      data: enrollment,
    });
    return created as Enrollment;
  }

  async updateStatus(
    userId: string,
    courseId: string,
    status: "active" | "completed"
  ): Promise<Enrollment> {
    const updated = await this.prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { status, progress: status === "completed" ? 100 : undefined },
    });
    return updated as Enrollment;
  }
}
