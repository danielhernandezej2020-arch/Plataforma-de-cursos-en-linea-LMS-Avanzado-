import { NextRequest, NextResponse } from "next/server";
import { evaluationService } from "@/container";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const cloned = await evaluationService.cloneEvaluation(params.id, {
      courseId: body.courseId,
      title: body.title,
      passingScore: body.passingScore,
    });
    return NextResponse.json(cloned, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
