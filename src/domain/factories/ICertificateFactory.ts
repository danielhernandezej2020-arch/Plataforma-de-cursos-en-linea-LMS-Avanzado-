import { Certificate } from "@/domain/entities/Certificate";

export interface GenerateCertificateInput {
  userId: string;
  courseId: string;
  type: "basic" | "verified";
  courseTitle: string;
  userName: string;
}

export interface ICertificateFactory {
  create(input: GenerateCertificateInput): Certificate;
}
