import { PrismaClient } from "@/lib/prisma";
import { IEvaluationRepository } from "@/domain/repositories/IEvaluationRepository";
import { Evaluation, EvaluationSubmission } from "@/domain/entities/Evaluation";

export class PrismaEvaluationRepository implements IEvaluationRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Evaluation | null> {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
    });
    return evaluation as Evaluation | null;
  }

  async findByCourseId(courseId: string): Promise<Evaluation[]> {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { courseId },
    });
    return evaluations as Evaluation[];
  }

  async save(evaluation: Evaluation): Promise<Evaluation> {
    const created = await this.prisma.evaluation.create({
      data: {
        id: evaluation.id,
        courseId: evaluation.courseId,
        title: evaluation.title,
        type: evaluation.type,
        passingScore: evaluation.passingScore,
        questions: evaluation.questions as any,
        createdAt: evaluation.createdAt,
      },
    });
    return created as Evaluation;
  }

  async saveSubmission(
    submission: EvaluationSubmission
  ): Promise<EvaluationSubmission> {
    const created = await this.prisma.evaluationSubmission.create({
      data: {
        id: submission.id,
        evaluationId: submission.evaluationId,
        userId: submission.userId,
        answers: submission.answers as any,
        score: submission.score,
        passed: submission.passed,
        submittedAt: submission.submittedAt,
      },
    });
    return created as EvaluationSubmission;
  }
}
