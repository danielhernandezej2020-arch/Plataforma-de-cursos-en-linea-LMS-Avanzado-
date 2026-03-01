import { IEnrollmentRepository } from "@/domain/repositories/IEnrollmentRepository";
import { ICourseRepository } from "@/domain/repositories/ICourseRepository";
import { IPaymentRepository } from "@/domain/repositories/IPaymentRepository";
import { RecommendationEngine } from "@/infrastructure/recommendations/RecommendationEngine";
import { Enrollment } from "@/domain/entities/Enrollment";
import { v4 as uuidv4 } from "uuid";

export class EnrollmentService {
  constructor(
    private enrollmentRepository: IEnrollmentRepository,
    private courseRepository: ICourseRepository,
    private paymentRepository: IPaymentRepository
  ) {}

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course not found");

    // Business rule: premium courses require completed payment
    if (course.type === "premium") {
      const payment = await this.paymentRepository.findCompletedPayment(
        userId,
        courseId
      );
      if (!payment) {
        throw new Error("Payment required for premium course");
      }
    }

    // Check if already enrolled
    const existing = await this.enrollmentRepository.findByUserAndCourse(
      userId,
      courseId
    );
    if (existing) {
      throw new Error("User is already enrolled in this course");
    }

    const enrollment: Enrollment = {
      id: uuidv4(),
      userId,
      courseId,
      status: "active",
      progress: 0,
      enrolledAt: new Date(),
    };

    const saved = await this.enrollmentRepository.save(enrollment);

    // Track for adaptive learning recommendations — SINGLETON
    RecommendationEngine.getInstance().trackInteraction(userId, courseId);

    return saved;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.findByUserId(userId);
  }
}
