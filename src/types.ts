export interface ExamState {
  currentQuestion: number;
  answers: Record<number, number>;
  timeRemaining: number;
  isSubmitted: boolean;
}

export type UserDetails = {
  name: string;
  email: string;
  createdAt: string;
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
  completed_at: string | null;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
  }[];
  question_order: string[]; // array of UUIDs in order presented
}
