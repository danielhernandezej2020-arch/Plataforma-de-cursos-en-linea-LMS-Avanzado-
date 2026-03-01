import { NextRequest, NextResponse } from "next/server";
import { certificateService } from "@/container";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }
    const certificates = await certificateService.getUserCertificates(userId);
    return NextResponse.json(certificates);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();
    const certificate = await certificateService.generateCertificate(
      userId,
      courseId
    );
    return NextResponse.json(certificate, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
