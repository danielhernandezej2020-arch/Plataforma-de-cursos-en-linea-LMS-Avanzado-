export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  type: "basic" | "verified";
  code: string;
  issuedAt: Date;
  metadata: Record<string, unknown> | null;
}
