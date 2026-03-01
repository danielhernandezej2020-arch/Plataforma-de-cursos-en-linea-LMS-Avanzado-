import { Course } from "@/domain/entities/Course";

export interface ICourseRepository {
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  findByCategory(category: string): Promise<Course[]>;
  save(course: Course): Promise<Course>;
  update(id: string, data: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<void>;
}
