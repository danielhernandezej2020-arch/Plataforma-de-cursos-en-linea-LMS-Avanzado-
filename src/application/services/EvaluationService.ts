import { IEvaluationRepository } from "@/domain/repositories/IEvaluationRepository";
import { IEnrollmentRepository } from "@/domain/repositories/IEnrollmentRepository";
import { IEvaluationFactory } from "@/domain/factories/IEvaluationFactory";
import { CreateEvaluationDTO, QuizQuestion } from "@/application/dto/CreateEvaluationDTO";
import { CloneEvaluationDTO } from "@/application/dto/CloneEvaluationDTO";
import { SubmitEvaluationDTO } from "@/application/dto/SubmitEvaluationDTO";
import { Evaluation, EvaluationSubmission } from "@/domain/entities/Evaluation";
import { EvaluationPrototype } from "@/infrastructure/prototypes/EvaluationPrototype";
import { v4 as uuidv4 } from "uuid";

export class EvaluationService {
  constructor(
    private evaluationRepository: IEvaluationRepository,
    private evaluationFactory: IEvaluationFactory, // FACTORY injected
    private enrollmentRepository: IEnrollmentRepository
  ) {}

  async createEvaluation(dto: CreateEvaluationDTO): Promise<Evaluation> {
    const evaluation = this.evaluationFactory.create(dto); // FACTORY METHOD
    return this.evaluationRepository.save(evaluation);
  }

  async cloneEvaluation(sourceId: string, dto: CloneEvaluationDTO): Promise<Evaluation> {
    const source = await this.evaluationRepository.findById(sourceId);
    if (!source) throw new Error("Source evaluation not found");
    // PROTOTYPE
    const prototype = new EvaluationPrototype(source);
    const cloned = prototype.clone({
      courseId: dto.courseId,
      title: dto.title ?? `${source.title} (copy)`,
      passingScore: dto.passingScore,
    });
    return this.evaluationRepository.save(cloned);
  }

  async getEvaluationsByCourse(courseId: string): Promise<Evaluation[]> {
    return this.evaluationRepository.findByCourseId(courseId);
  }

  async submitEvaluation(dto: SubmitEvaluationDTO): Promise<EvaluationSubmission> {
    const evaluation = await this.evaluationRepository.findById(dto.evaluationId);
    if (!evaluation) throw new Error("Evaluation not found");

    const score = this.calculateScore(evaluation, dto.answers);
    const passed = score >= evaluation.passingScore;

    const submission: EvaluationSubmission = {
      id: uuidv4(),
      evaluationId: dto.evaluationId,
      userId: dto.userId,
      answers: dto.answers,
      score,
      passed,
      submittedAt: new Date(),
    };

    await this.evaluationRepository.saveSubmission(submission);

    // If passed, mark enrollment as completed
    if (passed) {
      try {
        await this.enrollmentRepository.updateStatus(
          dto.userId,
          evaluation.courseId,
          "completed"
        );
      } catch {
        // Enrollment may not exist; log but don't fail
        console.warn(
          `Could not update enrollment status for user ${dto.userId} course ${evaluation.courseId}`
        );
      }
    }

    return submission;
  }

  private calculateScore(evaluation: Evaluation, answers: unknown): number {
    if (evaluation.type === "quiz") {
      const questions = evaluation.questions as QuizQuestion[];
      const userAnswers = answers as number[];

      if (!Array.isArray(questions) || !Array.isArray(userAnswers)) {
        throw new Error("Invalid quiz answer format");
      }

      let correct = 0;
      questions.forEach((q, i) => {
        if (userAnswers[i] === q.correctIndex) correct++;
      });

      return Math.round((correct / questions.length) * 100);
    }

    // Project: simulated scoring (in a real system, instructor would grade)
    return 75;
  }
}
