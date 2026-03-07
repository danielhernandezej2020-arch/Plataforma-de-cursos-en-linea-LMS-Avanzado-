import { Course } from "@/domain/entities/Course";
import { Evaluation } from "@/domain/entities/Evaluation";
import { Certificate } from "@/domain/entities/Certificate";
import { CreateCourseDTO } from "@/application/dto/CreateCourseDTO";
import { CreateEvaluationDTO } from "@/application/dto/CreateEvaluationDTO";
import { GenerateCertificateInput } from "@/domain/factories/ICertificateFactory";

// Omit `type` — the concrete factory family determines it, callers cannot bypass tier enforcement
export type TierCourseInput = Omit<CreateCourseDTO, "type">;
export type TierEvaluationInput = Omit<CreateEvaluationDTO, "type">;
export type TierCertificateInput = Omit<GenerateCertificateInput, "type">;

/**
 * Abstract Factory interface.
 *
 * Defines a contract for creating a family of related LMS content objects
 * that are consistent with a specific subscription tier (free or premium).
 *
 * Each concrete implementation ensures internal consistency:
 * - FreeTierContentFactory always produces free courses, project evaluations,
 *   and basic certificates.
 * - PremiumTierContentFactory always produces premium courses, quiz evaluations,
 *   and verified certificates.
 *
 * Pattern: Abstract Factory (GoF)
 */
export interface ILMSContentFactory {
  createCourse(input: TierCourseInput): Course;
  createEvaluation(input: TierEvaluationInput): Evaluation;
  createCertificate(input: TierCertificateInput): Certificate;
}
