import { NextRequest, NextResponse } from "next/server";
import { courseService } from "@/container";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await courseService.getCourse(params.id);
    const modules = await courseService.getCourseModules(params.id);
    return NextResponse.json({ ...course, modules });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
