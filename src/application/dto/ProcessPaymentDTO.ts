export interface ProcessPaymentDTO {
  userId: string;
  courseId: string;
  amount: number;
  provider: "stripe" | "paypal";
}
