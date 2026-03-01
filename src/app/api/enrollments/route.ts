import { NextRequest, NextResponse } from "next/server";
import { enrollmentService } from "@/container";

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();
    const enrollment = await enrollmentService.enroll(userId, courseId);
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
