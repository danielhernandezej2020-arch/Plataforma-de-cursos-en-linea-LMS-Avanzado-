import { Certificate } from "@/domain/entities/Certificate";
import { v4 as uuidv4 } from "uuid";

export class CertificateBuilder {
  private id: string = uuidv4();
  private userId: string = "";
  private courseId: string = "";
  private type: "basic" | "verified" = "basic";
  private code: string = "";
  private issuedAt: Date = new Date();
  private metadata: Record<string, unknown> = {};

  forUser(userId: string): this {
    this.userId = userId;
    return this;
  }

  forCourse(courseId: string): this {
    this.courseId = courseId;
    return this;
  }

  withType(type: "basic" | "verified"): this {
    this.type = type;
    return this;
  }

  withCode(code: string): this {
    this.code = code;
    return this;
  }

  withIssuedAt(date: Date): this {
    this.issuedAt = date;
    return this;
  }

  withMetadata(key: string, value: unknown): this {
    this.metadata[key] = value;
    return this;
  }

  build(): Certificate {
    if (!this.userId) throw new Error("User ID is required");
    if (!this.courseId) throw new Error("Course ID is required");
    if (!this.code) throw new Error("Certificate code is required");

    return {
      id: this.id,
      userId: this.userId,
      courseId: this.courseId,
      type: this.type,
      code: this.code,
      issuedAt: this.issuedAt,
      metadata: Object.keys(this.metadata).length > 0 ? this.metadata : null,
    };
  }
}
