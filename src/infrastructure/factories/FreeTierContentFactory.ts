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
 * Concrete Abstract Factory for the FREE subscription tier.
 *
 * Enforces the following family constraints:
 * - Courses:      type = "free",    price = 0
 * - Evaluations:  type = "project", passingScore = 60 (if not supplied)
 * - Certificates: type = "basic"
 *
 * Delegates all object construction to the injected Factory Method
 * implementations, following the Dependency Inversion Principle.
 *
 * Pattern: Abstract Factory (GoF) - Concrete Factory
 */
export class FreeTierContentFactory implements ILMSContentFactory {
  constructor(
    private readonly courseFactory: ICourseFactory,
    private readonly evaluationFactory: IEvaluationFactory,
    private readonly certificateFactory: ICertificateFactory
  ) {}

  createCourse(input: TierCourseInput): Course {
    return this.courseFactory.create({
      ...input,
      type: "free",
      price: 0,
    });
  }

  createEvaluation(input: TierEvaluationInput): Evaluation {
    return this.evaluationFactory.create({
      ...input,
      type: "project",
      passingScore: input.passingScore ?? 60,
    });
  }

  createCertificate(input: TierCertificateInput): Certificate {
    return this.certificateFactory.create({
      ...input,
      type: "basic",
    });
  }
}
