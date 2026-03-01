import { NextRequest, NextResponse } from "next/server";
import { VideoConferenceService } from "@/infrastructure/video/VideoConferenceService";

export async function GET() {
  try {
    const service = VideoConferenceService.getInstance(); // SINGLETON
    return NextResponse.json({
      activeSessions: service.getActiveSessionCount(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { courseId, hostId } = await request.json();
    const service = VideoConferenceService.getInstance(); // SINGLETON
    const session = await service.createSession(courseId, hostId);

    // Start recording automatically
    const recordingUrl = await service.startRecording(session.id);

    return NextResponse.json(
      { ...session, recordingUrl },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
