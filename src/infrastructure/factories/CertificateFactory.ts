import {
  ICertificateFactory,
  GenerateCertificateInput,
} from "@/domain/factories/ICertificateFactory";
import { Certificate } from "@/domain/entities/Certificate";
import { v4 as uuidv4 } from "uuid";

export class CertificateFactory implements ICertificateFactory {
  create(input: GenerateCertificateInput): Certificate {
    const code = this.generateCode(input.type);

    if (input.type === "verified") {
      return {
        id: uuidv4(),
        userId: input.userId,
        courseId: input.courseId,
        type: "verified",
        code,
        issuedAt: new Date(),
        metadata: {
          verificationUrl: `https://lms.local/verify/${code}`,
          courseTitle: input.courseTitle,
          recipientName: input.userName,
          verifiedAt: new Date().toISOString(),
        },
      };
    }

    return {
      id: uuidv4(),
      userId: input.userId,
      courseId: input.courseId,
      type: "basic",
      code,
      issuedAt: new Date(),
      metadata: {
        courseTitle: input.courseTitle,
        recipientName: input.userName,
      },
    };
  }

  private generateCode(type: "basic" | "verified"): string {
    const prefix = type === "verified" ? "VCERT" : "BCERT";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
