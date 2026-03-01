export interface Course {
  id: string;
  title: string;
  description: string;
  type: "free" | "premium";
  price: number;
  instructorId: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FreeCourse extends Course {
  type: "free";
  price: 0;
}

export interface PremiumCourse extends Course {
  type: "premium";
}
