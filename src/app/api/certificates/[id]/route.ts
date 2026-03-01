import { NextRequest, NextResponse } from "next/server";
import { certificateService } from "@/container";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await certificateService.getCertificate(params.id);
    return NextResponse.json(certificate);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
