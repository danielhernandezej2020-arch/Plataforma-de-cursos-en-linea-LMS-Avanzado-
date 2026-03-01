import { Certificate } from "@/domain/entities/Certificate";

export interface ICertificateRepository {
  findById(id: string): Promise<Certificate | null>;
  findByUserId(userId: string): Promise<Certificate[]>;
  save(certificate: Certificate): Promise<Certificate>;
}
