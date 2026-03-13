import {
  ICertificateFactory,
  GenerateCertificateInput,
} from "@/domain/factories/ICertificateFactory";
import { Certificate } from "@/domain/entities/Certificate";
import { CertificateBuilder } from "@/domain/builders/CertificateBuilder";

export class CertificateFactory implements ICertificateFactory {
  create(input: GenerateCertificateInput): Certificate {
    const code = this.generateCode(input.type);

    const builder = new CertificateBuilder()
      .forUser(input.userId)
      .forCourse(input.courseId)
      .withType(input.type)
      .withCode(code)
      .withMetadata("courseTitle", input.courseTitle)
      .withMetadata("recipientName", input.userName);

    if (input.type === "verified") {
      builder
        .withMetadata("verificationUrl", `https://lms.local/verify/${code}`)
        .withMetadata("verifiedAt", new Date().toISOString());
    }

    return builder.build(); // BUILDER
  }

  private generateCode(type: "basic" | "verified"): string {
    const prefix = type === "verified" ? "VCERT" : "BCERT";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
