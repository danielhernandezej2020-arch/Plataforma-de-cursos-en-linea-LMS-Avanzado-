import { Course } from "@/domain/entities/Course";
import { CreateCourseDTO } from "@/application/dto/CreateCourseDTO";

export interface ICourseFactory {
  create(dto: CreateCourseDTO): Course;
}
