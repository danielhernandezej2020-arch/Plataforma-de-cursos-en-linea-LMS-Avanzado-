import {
  IVideoConferenceService,
  VideoSession,
} from "@/domain/services/IVideoConferenceService";

/**
 * Implementación del patrón **Singleton**.
 * 
 * Garantiza que exista **una única instancia** de VideoConferenceService en toda la aplicación,
 * centralizando la gestión de sesiones de videconferencia activas y limitando el número
 * máximo de sesiones concurrentes.
 * 
 * Uso: VideoConferenceService.getInstance() en lugar de new VideoConferenceService()
 */


export class VideoConferenceService implements IVideoConferenceService {
  private static instance: VideoConferenceService | null = null;
  private activeSessions: Map<string, VideoSession> = new Map();
  private readonly maxConcurrentSessions: number = 100;

  private constructor() {
    console.log("[VideoConference] Service initialized (simulated)");
  }

  public static getInstance(): VideoConferenceService {
    if (!VideoConferenceService.instance) {
      VideoConferenceService.instance = new VideoConferenceService();
    }
    return VideoConferenceService.instance;
  }

  public async createSession(
    courseId: string,
    hostId: string
  ): Promise<VideoSession> {
    if (this.activeSessions.size >= this.maxConcurrentSessions) {
      throw new Error("Maximum concurrent sessions reached");
    }

    const sessionId = `vs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const session: VideoSession = {
      id: sessionId,
      courseId,
      hostId,
      joinUrl: `https://simulated-video.lms.local/join/${sessionId}`,
      status: "active",
      createdAt: new Date(),
    };

    this.activeSessions.set(session.id, session);
    return session;
  }

  public async startRecording(sessionId: string): Promise<string> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const recordingUrl = `https://simulated-video.lms.local/recordings/${sessionId}.mp4`;
    session.recordingUrl = recordingUrl;
    return recordingUrl;
  }

  public async endSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.status = "ended";
      this.activeSessions.delete(sessionId);
    }
  }

  public getActiveSessionCount(): number {
    return this.activeSessions.size;
  }
}
