export interface Module {
  id: string;
  courseId: string;
  title: string;
  content: string;
  orderIndex: number;
  videoUrl: string | null;
}
