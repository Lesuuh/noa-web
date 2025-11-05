export interface ExamState {
  currentQuestion: number;
  answers: Record<number, number>;
  timeRemaining: number;
  isSubmitted: boolean;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export type UserContextType = Omit<User, "created_at" | "updated_at"> | null;

export type UserContextProp = {
  user: UserContextType;
  loading: boolean;
};

export interface Question {
  id: string; // UUID
  exam_id: string; // UUID or foreign key
  question: string;
  options: string[]; // e.g. ["A", "B", "C", "D"]
  correct_answer: number; // index of the correct option
  created_at: string; // or Date
}

export interface ExamAttempt {
  id: string; // UUID
  user_id: string;
  exam_id: string;
  score: number;
  started_at: string; // or Date
  submitted_at: string;
  answers: {
    [questionId: string]: number;
  };
  question_order: string[]; // array of UUIDs in order presented
  isPaid: boolean;
  status: "Completed" | "In Progress";
  duration_seconds: number;
}
