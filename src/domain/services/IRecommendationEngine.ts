export interface Recommendation {
  courseId: string;
  courseTitle: string;
  reason: string;
  score: number;
}

export interface IRecommendationEngine {
  trackInteraction(userId: string, courseId: string): void;
  getRecommendations(
    userId: string,
    allCourses: Array<{ id: string; category: string; title: string }>,
    enrolledCourseIds: string[]
  ): Promise<Recommendation[]>;
}
