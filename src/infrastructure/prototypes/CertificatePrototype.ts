import { Certificate } from "@/domain/entities/Certificate";
import { IPrototype } from "@/domain/prototypes/IPrototype";
import { v4 as uuidv4 } from "uuid";

type CertificateOverrides = Partial<Pick<Certificate, "userId" | "courseId" | "type">>;

export class CertificatePrototype implements IPrototype<Certificate, CertificateOverrides> {
  constructor(private readonly source: Certificate) {}

  clone(overrides?: CertificateOverrides): Certificate {
    const type = overrides?.type ?? this.source.type;
    const prefix = type === "verified" ? "VCERT" : "BCERT";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    const code = `${prefix}-${timestamp}-${random}`;

    return {
      id: uuidv4(),
      userId: this.source.userId,
      courseId: this.source.courseId,
      type: this.source.type,
      code,
      issuedAt: new Date(),
      metadata: this.source.metadata ? { ...this.source.metadata } : null,
      ...overrides,
    };
  }
}
