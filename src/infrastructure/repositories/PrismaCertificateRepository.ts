import { PrismaClient } from "@/lib/prisma";
import { ICertificateRepository } from "@/domain/repositories/ICertificateRepository";
import { Certificate } from "@/domain/entities/Certificate";

export class PrismaCertificateRepository implements ICertificateRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Certificate | null> {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
    });
    if (!cert) return null;
    return {
      ...cert,
      metadata: cert.metadata as Record<string, unknown> | null,
    } as Certificate;
  }

  async findByUserId(userId: string): Promise<Certificate[]> {
    const certs = await this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
    });
    return certs.map((c) => ({
      ...c,
      metadata: c.metadata as Record<string, unknown> | null,
    })) as Certificate[];
  }

  async save(certificate: Certificate): Promise<Certificate> {
    const created = await this.prisma.certificate.create({
      data: {
        id: certificate.id,
        userId: certificate.userId,
        courseId: certificate.courseId,
        type: certificate.type,
        code: certificate.code,
        issuedAt: certificate.issuedAt,
        metadata: certificate.metadata as any,
      },
    });
    return {
      ...created,
      metadata: created.metadata as Record<string, unknown> | null,
    } as Certificate;
  }
}
