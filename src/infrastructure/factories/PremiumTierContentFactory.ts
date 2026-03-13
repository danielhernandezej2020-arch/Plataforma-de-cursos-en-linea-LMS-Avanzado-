import {
  ILMSContentFactory,
  TierCourseInput,
  TierEvaluationInput,
  TierCertificateInput,
} from "@/domain/factories/ILMSContentFactory";
import { ICourseFactory } from "@/domain/factories/ICourseFactory";
import { IEvaluationFactory } from "@/domain/factories/IEvaluationFactory";
import { ICertificateFactory } from "@/domain/factories/ICertificateFactory";
import { Course } from "@/domain/entities/Course";
import { Evaluation } from "@/domain/entities/Evaluation";
import { Certificate } from "@/domain/entities/Certificate";

/**
 * Concrete Abstract Factory for the PREMIUM subscription tier.
 *
 * Enforces the following family constraints:
 * - Courses:      type = "premium"  (price must be > 0 or CourseFactory throws)
 * - Evaluations:  type = "quiz",    passingScore = 80 (if not supplied)
 * - Certificates: type = "verified"
 *
 * Delegates all object construction to the injected Factory Method
 * implementations, following the Dependency Inversion Principle.
 *
 * Pattern: Abstract Factory (GoF) - Concrete Factory
 */
export class PremiumTierContentFactory implements ILMSContentFactory {
  constructor(
    private readonly courseFactory: ICourseFactory,
    private readonly evaluationFactory: IEvaluationFactory,
    private readonly certificateFactory: ICertificateFactory
  ) {}

  createCourse(input: TierCourseInput): Course {
    // CourseFactory enforces price > 0 for premium type internally.
    // If price is missing or <= 0, CourseFactory will throw:
    // "Premium courses must have a price greater than 0"
    return this.courseFactory.create({
      ...input,
      type: "premium",
    });
  }

  createEvaluation(input: TierEvaluationInput): Evaluation {
    // Quiz evaluations require questions as QuizQuestion[].
    // Callers must supply valid questions array; EvaluationFactory validates.
    return this.evaluationFactory.create({
      ...input,
      type: "quiz",
      passingScore: input.passingScore ?? 80,
    });
  }

  createCertificate(input: TierCertificateInput): Certificate {
    return this.certificateFactory.create({
      ...input,
      type: "verified",
    });
  }
}
