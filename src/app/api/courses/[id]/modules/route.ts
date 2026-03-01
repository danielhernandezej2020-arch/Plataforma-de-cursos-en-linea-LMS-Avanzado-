import { NextRequest, NextResponse } from "next/server";
import { courseService } from "@/container";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const module = await courseService.addModule(params.id, body);
    return NextResponse.json(module, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
