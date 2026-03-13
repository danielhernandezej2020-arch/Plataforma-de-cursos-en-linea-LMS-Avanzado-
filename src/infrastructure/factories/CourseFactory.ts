import { ICourseFactory } from "@/domain/factories/ICourseFactory";
import { Course } from "@/domain/entities/Course";
import { CreateCourseDTO } from "@/application/dto/CreateCourseDTO";
import { CourseBuilder } from "@/domain/builders/CourseBuilder";

export class CourseFactory implements ICourseFactory {
  create(dto: CreateCourseDTO): Course {
    if (dto.type === "premium" && (!dto.price || dto.price <= 0)) {
      throw new Error("Premium courses must have a price greater than 0");
    }

    const now = new Date();
    const builder = new CourseBuilder()
      .withTitle(dto.title)
      .withDescription(dto.description)
      .withType(dto.type)
      .withInstructor(dto.instructorId)
      .withCategory(dto.category || "general")
      .withTimestamps(now, now);

    if (dto.type === "premium" && dto.price) {
      builder.withPrice(dto.price);
    }

    return builder.build(); // BUILDER
  }
}
