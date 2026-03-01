import {
  IRecommendationEngine,
  Recommendation,
} from "@/domain/services/IRecommendationEngine";

export class RecommendationEngine implements IRecommendationEngine {
  private static instance: RecommendationEngine | null = null;
  private userInteractionCache: Map<string, string[]> = new Map();

  private constructor() {
    console.log("[RecommendationEngine] Initialized (simulated adaptive learning)");
  }

  public static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    return RecommendationEngine.instance;
  }

  public trackInteraction(userId: string, courseId: string): void {
    const history = this.userInteractionCache.get(userId) || [];
    if (!history.includes(courseId)) {
      history.push(courseId);
      this.userInteractionCache.set(userId, history);
    }
  }

  public async getRecommendations(
    userId: string,
    allCourses: Array<{ id: string; category: string; title: string }>,
    enrolledCourseIds: string[]
  ): Promise<Recommendation[]> {
    const enrolledCategories = allCourses
      .filter((c) => enrolledCourseIds.includes(c.id))
      .map((c) => c.category);

    const uniqueCategories = Array.from(new Set(enrolledCategories));

    return allCourses
      .filter((c) => !enrolledCourseIds.includes(c.id))
      .filter((c) => uniqueCategories.includes(c.category))
      .slice(0, 5)
      .map((c) => ({
        courseId: c.id,
        courseTitle: c.title,
        reason: `Based on your interest in "${c.category}" courses`,
        score: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100,
      }));
  }
}
