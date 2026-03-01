import { NextRequest, NextResponse } from "next/server";
import { RecommendationEngine } from "@/infrastructure/recommendations/RecommendationEngine";
import { courseService, enrollmentRepository } from "@/container";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const engine = RecommendationEngine.getInstance(); // SINGLETON
    const allCourses = await courseService.listCourses();
    const enrollments = await enrollmentRepository.findByUserId(userId);
    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    const recommendations = await engine.getRecommendations(
      userId,
      allCourses.map((c) => ({ id: c.id, category: c.category, title: c.title })),
      enrolledCourseIds
    );

    return NextResponse.json(recommendations);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
