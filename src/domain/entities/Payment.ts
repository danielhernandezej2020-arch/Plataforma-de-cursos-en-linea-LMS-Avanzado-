export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  provider: "stripe" | "paypal";
  status: "pending" | "completed" | "failed";
  transactionId: string | null;
  createdAt: Date;
}
