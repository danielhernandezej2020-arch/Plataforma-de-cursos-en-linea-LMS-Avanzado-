import { NextRequest, NextResponse } from "next/server";
import { courseService } from "@/container";

export async function GET() {
  try {
    const courses = await courseService.listCourses();
    return NextResponse.json(courses);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const course = await courseService.createCourse(body);
    return NextResponse.json(course, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
