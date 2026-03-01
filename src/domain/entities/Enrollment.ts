export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: "active" | "completed";
  progress: number;
  enrolledAt: Date;
}
