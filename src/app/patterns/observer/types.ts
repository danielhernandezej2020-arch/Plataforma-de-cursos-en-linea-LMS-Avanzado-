export type LMSEventType =
  | "notification:new"
  | "course:completed"
  | "quiz:submitted"
  | "checkout:success";

export interface LMSEventPayload {
  "notification:new":  { message: string; type: "info" | "success" | "warning" };
  "course:completed":  { courseId: string; courseTitle: string };
  "quiz:submitted":    { score: number; passed: boolean };
  "checkout:success":  { plan: string };
}

export type EventHandler<T extends LMSEventType> = (payload: LMSEventPayload[T]) => void;
