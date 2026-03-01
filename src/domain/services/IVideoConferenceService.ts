export interface VideoSession {
  id: string;
  courseId: string;
  hostId: string;
  joinUrl: string;
  recordingUrl?: string;
  status: "active" | "ended";
  createdAt: Date;
}

export interface IVideoConferenceService {
  createSession(courseId: string, hostId: string): Promise<VideoSession>;
  startRecording(sessionId: string): Promise<string>;
  endSession(sessionId: string): Promise<void>;
  getActiveSessionCount(): number;
}
