import { Enrollment } from "@/domain/entities/Enrollment";

export interface IEnrollmentRepository {
  findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null>;
  findByUserId(userId: string): Promise<Enrollment[]>;
  save(enrollment: Enrollment): Promise<Enrollment>;
  updateStatus(userId: string, courseId: string, status: "active" | "completed"): Promise<Enrollment>;
}
