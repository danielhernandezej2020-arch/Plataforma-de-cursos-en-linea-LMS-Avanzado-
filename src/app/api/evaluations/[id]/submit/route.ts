import { NextRequest, NextResponse } from "next/server";
import { evaluationService } from "@/container";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const submission = await evaluationService.submitEvaluation({
      evaluationId: params.id,
      userId: body.userId,
      answers: body.answers,
    });
    return NextResponse.json(submission, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
