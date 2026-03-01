import { ICourseFactory } from "@/domain/factories/ICourseFactory";
import { Course } from "@/domain/entities/Course";
import { CreateCourseDTO } from "@/application/dto/CreateCourseDTO";
import { v4 as uuidv4 } from "uuid";

export class CourseFactory implements ICourseFactory {
  create(dto: CreateCourseDTO): Course {
    const now = new Date();
    const base = {
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      instructorId: dto.instructorId,
      category: dto.category || "general",
      createdAt: now,
      updatedAt: now,
    };

    if (dto.type === "premium") {
      if (!dto.price || dto.price <= 0) {
        throw new Error("Premium courses must have a price greater than 0");
      }
      return { ...base, type: "premium" as const, price: dto.price };
    }

    return { ...base, type: "free" as const, price: 0 };
  }
}
