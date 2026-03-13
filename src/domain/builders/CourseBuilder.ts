import { Course } from "@/domain/entities/Course";
import { v4 as uuidv4 } from "uuid";

export class CourseBuilder {
  private id: string = uuidv4();
  private title: string = "";
  private description: string = "";
  private type: "free" | "premium" = "free";
  private price: number = 0;
  private instructorId: string = "";
  private category: string = "general";
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withTitle(title: string): this {
    this.title = title;
    return this;
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  withType(type: "free" | "premium"): this {
    this.type = type;
    return this;
  }

  withPrice(price: number): this {
    this.price = price;
    return this;
  }

  withInstructor(instructorId: string): this {
    this.instructorId = instructorId;
    return this;
  }

  withCategory(category: string): this {
    this.category = category;
    return this;
  }

  withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    return this;
  }

  build(): Course {
    if (!this.title) throw new Error("Course title is required");
    if (!this.instructorId) throw new Error("Instructor ID is required");
    if (this.type === "premium" && this.price <= 0) {
      throw new Error("Premium courses must have a price greater than 0");
    }

    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      price: this.type === "free" ? 0 : this.price,
      instructorId: this.instructorId,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
