import { ICertificateRepository } from "@/domain/repositories/ICertificateRepository";
import { IEnrollmentRepository } from "@/domain/repositories/IEnrollmentRepository";
import { ICourseRepository } from "@/domain/repositories/ICourseRepository";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { ICertificateFactory } from "@/domain/factories/ICertificateFactory";
import { Certificate } from "@/domain/entities/Certificate";
import { CertificatePrototype } from "@/infrastructure/prototypes/CertificatePrototype";

export class CertificateService {
  constructor(
    private certificateRepository: ICertificateRepository,
    private certificateFactory: ICertificateFactory, // FACTORY injected
    private enrollmentRepository: IEnrollmentRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  async generateCertificate(
    userId: string,
    courseId: string
  ): Promise<Certificate> {
    // Business rule: must have completed enrollment (passed evaluation)
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(
      userId,
      courseId
    );
    if (!enrollment || enrollment.status !== "completed") {
      throw new Error("Course not completed. Pass the evaluation first.");
    }

    // Business rule: certificate type depends on course type
    const course = await this.courseRepository.findById(courseId);
    const user = await this.userRepository.findById(userId);
    if (!course) throw new Error("Course not found");
    if (!user) throw new Error("User not found");

    const certType = course.type === "premium" ? "verified" : "basic";

    // FACTORY METHOD determines the structure based on type
    const certificate = this.certificateFactory.create({
      userId,
      courseId,
      type: certType,
      courseTitle: course.title,
      userName: user.name,
    });

    return this.certificateRepository.save(certificate);
  }

  async cloneCertificateTemplate(templateId: string, userIds: string[]): Promise<Certificate[]> {
    const template = await this.certificateRepository.findById(templateId);
    if (!template) throw new Error("Certificate template not found");
    // PROTOTYPE — single prototype, N clones
    const prototype = new CertificatePrototype(template);
    const results: Certificate[] = [];
    for (const userId of userIds) {
      const cloned = prototype.clone({ userId });
      results.push(await this.certificateRepository.save(cloned));
    }
    return results;
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    return this.certificateRepository.findByUserId(userId);
  }

  async getCertificate(id: string): Promise<Certificate> {
    const cert = await this.certificateRepository.findById(id);
    if (!cert) throw new Error("Certificate not found");
    return cert;
  }
}
