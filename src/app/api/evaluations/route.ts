import { NextRequest, NextResponse } from "next/server";
import { evaluationService } from "@/container";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const evaluation = await evaluationService.createEvaluation(body);
    return NextResponse.json(evaluation, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
