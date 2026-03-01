export interface CreateCourseDTO {
  title: string;
  description: string;
  type: "free" | "premium";
  price?: number;
  instructorId: string;
  category?: string;
}
