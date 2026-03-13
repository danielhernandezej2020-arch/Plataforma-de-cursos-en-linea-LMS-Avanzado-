import { Evaluation } from "@/domain/entities/Evaluation";
import { QuizQuestion } from "@/application/dto/CreateEvaluationDTO";
import { v4 as uuidv4 } from "uuid";

export class EvaluationBuilder {
  private id: string = uuidv4();
  private courseId: string = "";
  private title: string = "";
  private type: "quiz" | "project" = "quiz";
  private passingScore: number = 70;
  private questions: unknown = [];
  private createdAt: Date = new Date();

  withCourseId(courseId: string): this {
    this.courseId = courseId;
    return this;
  }

  withTitle(title: string): this {
    this.title = title;
    return this;
  }

  withType(type: "quiz" | "project"): this {
    this.type = type;
    return this;
  }

  withPassingScore(score: number): this {
    this.passingScore = score;
    return this;
  }

  withQuestions(questions: unknown): this {
    this.questions = questions;
    return this;
  }

  build(): Evaluation {
    if (!this.courseId) throw new Error("Course ID is required");
    if (!this.title) throw new Error("Evaluation title is required");

    if (this.type === "quiz") {
      const questions = this.questions as QuizQuestion[];
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Quiz must have at least one question");
      }
      for (const q of questions) {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(
            "Each quiz question must have a question text and at least 2 options"
          );
        }
        if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
          throw new Error("correctIndex must be a valid index within options");
        }
      }
    }

    return {
      id: this.id,
      courseId: this.courseId,
      title: this.title,
      type: this.type,
      passingScore: this.passingScore,
      questions: this.questions,
      createdAt: this.createdAt,
    };
  }
}
